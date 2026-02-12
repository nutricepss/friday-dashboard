#!/usr/bin/env python3
import imaplib
import email
from email.header import decode_header
import json
import re
from datetime import datetime, timedelta
import time

# Load credentials
with open('/home/assistant4himanshu/.openclaw/credentials/gmail-app-passwords.json', 'r') as f:
    creds = json.load(f)

def clean_text(text):
    """Clean text for display"""
    if text:
        return text.encode('utf-8', 'ignore').decode('utf-8')
    return ""

def decode_mime_words(s):
    """Decode MIME encoded words in email headers"""
    if not s:
        return ""
    decoded = decode_header(s)
    result = []
    for part, encoding in decoded:
        if isinstance(part, bytes):
            if encoding:
                try:
                    result.append(part.decode(encoding))
                except:
                    result.append(part.decode('utf-8', 'ignore'))
            else:
                result.append(part.decode('utf-8', 'ignore'))
        else:
            result.append(part)
    return ' '.join(result)

def analyze_newsletters(mail, folder='INBOX'):
    """Analyze newsletters in inbox to find the most valuable one"""
    mail.select(folder)
    
    # Search for emails from common newsletter senders
    newsletter_senders = [
        'newsletter', 'digest', 'weekly', 'daily', 'roundup',
        'substack', 'beehiiv', 'convertkit', 'mailchimp',
        'medium', 'linkedin', 'producthunt', 'hackernews',
        'fitness', 'health', 'nutrition', 'wellness',
        'business', 'marketing', 'entrepreneur'
    ]
    
    newsletter_pattern = '|'.join(newsletter_senders)
    
    # Search for recent emails (last 30 days)
    date_cutoff = (datetime.now() - timedelta(days=30)).strftime('%d-%b-%Y')
    status, messages = mail.search(None, f'(SINCE "{date_cutoff}")')
    
    newsletter_emails = {}
    total_analyzed = 0
    
    if status == 'OK':
        email_ids = messages[0].split()
        
        # Limit to first 100 emails for analysis
        for email_id in email_ids[:100]:
            total_analyzed += 1
            status, msg_data = mail.fetch(email_id, '(RFC822)')
            
            if status == 'OK':
                msg = email.message_from_bytes(msg_data[0][1])
                
                # Check sender
                from_header = msg.get('From', '')
                subject = decode_mime_words(msg.get('Subject', ''))
                
                from_lower = from_header.lower()
                subject_lower = subject.lower()
                
                # Check if it looks like a newsletter
                is_newsletter = False
                for pattern in newsletter_senders:
                    if pattern in from_lower or pattern in subject_lower:
                        is_newsletter = True
                        break
                
                # Also check for common newsletter indicators in headers
                list_unsubscribe = msg.get('List-Unsubscribe', '')
                if list_unsubscribe:
                    is_newsletter = True
                
                if is_newsletter:
                    sender = clean_text(from_header)
                    if sender not in newsletter_emails:
                        newsletter_emails[sender] = {
                            'count': 0,
                            'subjects': [],
                            'latest_date': None
                        }
                    newsletter_emails[sender]['count'] += 1
                    newsletter_emails[sender]['subjects'].append(clean_text(subject))
                    
                    # Get date
                    date_str = msg.get('Date')
                    if date_str:
                        newsletter_emails[sender]['latest_date'] = date_str
    
    return newsletter_emails, total_analyzed

def clean_spam_folder(mail, account_name):
    """Clean spam/junk folder"""
    try:
        # Select spam folder (different names in different accounts)
        spam_folders = ['[Gmail]/Spam', 'Spam', 'Junk', '[Gmail]/Junk']
        deleted_count = 0
        
        for folder in spam_folders:
            try:
                status, folder_info = mail.select(folder)
                if status == 'OK':
                    print(f"  Found spam folder: {folder}")
                    
                    # Get all messages in spam
                    status, messages = mail.search(None, 'ALL')
                    if status == 'OK':
                        email_ids = messages[0].split()
                        spam_count = len(email_ids)
                        
                        if spam_count > 0:
                            # Delete all spam emails
                            for email_id in email_ids:
                                mail.store(email_id, '+FLAGS', '\\Deleted')
                            
                            # Expunge to permanently delete
                            mail.expunge()
                            deleted_count += spam_count
                            print(f"  Deleted {spam_count} emails from {folder}")
                    
                    # Close this folder
                    mail.close()
            except Exception as e:
                # Try next folder name
                continue
        
        return deleted_count
    except Exception as e:
        print(f"  Error cleaning spam: {e}")
        return 0

def process_account(account_key, account_info):
    """Process a single Gmail account"""
    print(f"\nProcessing account: {account_key} ({account_info['user']})")
    print("-" * 50)
    
    total_deleted = 0
    newsletters = {}
    
    try:
        # Connect to Gmail IMAP
        mail = imaplib.IMAP4_SSL('imap.gmail.com')
        mail.login(account_info['user'], account_info['pass'])
        
        # 1. Clean spam folder
        spam_deleted = clean_spam_folder(mail, account_key)
        total_deleted += spam_deleted
        
        # 2. Analyze newsletters
        newsletters, analyzed_count = analyze_newsletters(mail, 'INBOX')
        
        mail.logout()
        
        return {
            'account': account_key,
            'email': account_info['user'],
            'spam_deleted': spam_deleted,
            'newsletters_found': len(newsletters),
            'newsletters': newsletters,
            'emails_analyzed': analyzed_count
        }
        
    except Exception as e:
        print(f"  Error processing account: {e}")
        return {
            'account': account_key,
            'email': account_info['user'],
            'error': str(e),
            'spam_deleted': 0,
            'newsletters_found': 0,
            'newsletters': {},
            'emails_analyzed': 0
        }

def select_best_newsletter(all_newsletters):
    """Select the most valuable newsletter from all accounts"""
    if not all_newsletters:
        return None
    
    # Score newsletters based on various factors
    scored_newsletters = []
    
    for account_data in all_newsletters:
        for sender, data in account_data['newsletters'].items():
            # Calculate score
            score = 0
            
            # Higher score for more frequent newsletters (shows consistency)
            score += min(data['count'] * 2, 20)  # Cap at 20
            
            # Check for fitness/health related content (most relevant for Himanshu)
            sender_lower = sender.lower()
            fitness_keywords = ['fitness', 'health', 'nutrition', 'wellness', 'exercise', 'workout', 'diet', 'coach']
            business_keywords = ['business', 'marketing', 'entrepreneur', 'startup', 'growth']
            
            for keyword in fitness_keywords:
                if keyword in sender_lower:
                    score += 15
                    break
            
            for keyword in business_keywords:
                if keyword in sender_lower:
                    score += 10
                    break
            
            # Check subject lines for relevance
            relevant_subjects = 0
            for subject in data['subjects']:
                subject_lower = subject.lower()
                if any(keyword in subject_lower for keyword in fitness_keywords + business_keywords):
                    relevant_subjects += 1
            
            score += min(relevant_subjects * 3, 15)
            
            # Check for reputable sources
            reputable_domains = ['substack.com', 'medium.com', 'linkedin.com', 'producthunt.com', 'hackernews.com']
            for domain in reputable_domains:
                if domain in sender_lower:
                    score += 5
                    break
            
            scored_newsletters.append({
                'sender': sender,
                'account': account_data['account'],
                'count': data['count'],
                'subjects': data['subjects'][:5],  # First 5 subjects
                'latest_date': data['latest_date'],
                'score': score
            })
    
    # Sort by score descending
    scored_newsletters.sort(key=lambda x: x['score'], reverse=True)
    
    return scored_newsletters[0] if scored_newsletters else None

def main():
    print("=" * 60)
    print("GMAIL EMAIL CLEANUP & NEWSLETTER ANALYSIS")
    print("=" * 60)
    
    all_results = []
    total_spam_deleted = 0
    
    # Process all accounts
    for account_key, account_info in creds['accounts'].items():
        result = process_account(account_key, account_info)
        all_results.append(result)
        
        if 'error' not in result:
            total_spam_deleted += result['spam_deleted']
    
    print("\n" + "=" * 60)
    print("SUMMARY REPORT")
    print("=" * 60)
    
    # Print account summaries
    for result in all_results:
        if 'error' in result:
            print(f"\n{result['account']} ({result['email']}): ERROR - {result['error']}")
        else:
            print(f"\n{result['account']} ({result['email']}):")
            print(f"  Spam/Junk emails deleted: {result['spam_deleted']}")
            print(f"  Newsletters identified: {result['newsletters_found']}")
            print(f"  Emails analyzed: {result['emails_analyzed']}")
    
    print(f"\nTotal spam emails deleted across all accounts: {total_spam_deleted}")
    
    # Select best newsletter
    print("\n" + "=" * 60)
    print("NEWSLETTER RECOMMENDATION")
    print("=" * 60)
    
    best_newsletter = select_best_newsletter(all_results)
    
    if best_newsletter:
        print(f"\n🎯 RECOMMENDED DAILY NEWSLETTER:")
        print(f"   Sender: {best_newsletter['sender']}")
        print(f"   From account: {best_newsletter['account']}")
        print(f"   Frequency: {best_newsletter['count']} emails in last 30 days")
        print(f"   Latest: {best_newsletter['latest_date']}")
        print(f"   Sample subjects:")
        for i, subject in enumerate(best_newsletter['subjects'], 1):
            print(f"     {i}. {subject[:80]}{'...' if len(subject) > 80 else ''}")
        
        # Explain why this is recommended
        print(f"\n   WHY RECOMMENDED:")
        print(f"   • High frequency suggests consistent, daily content")
        
        # Check content type
        sender_lower = best_newsletter['sender'].lower()
        if any(keyword in sender_lower for keyword in ['fitness', 'health', 'nutrition', 'wellness']):
            print(f"   • Fitness/health content aligns with Himanshu's coaching business")
        elif any(keyword in sender_lower for keyword in ['business', 'marketing', 'entrepreneur']):
            print(f"   • Business/marketing content supports business growth")
        
        # Check source reputation
        if 'substack.com' in sender_lower:
            print(f"   • Substack newsletters often have high-quality, curated content")
        elif 'medium.com' in sender_lower:
            print(f"   • Medium publications provide thoughtful, in-depth articles")
        
        print(f"   • Regular reading can provide daily inspiration and industry insights")
    else:
        print("\nNo newsletters found to recommend.")
        print("Consider subscribing to fitness/health industry newsletters or")
        print("business/marketing newsletters relevant to coaching business.")
    
    # Save results to file
    with open('email_cleanup_report.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_spam_deleted': total_spam_deleted,
            'accounts': all_results,
            'recommended_newsletter': best_newsletter
        }, f, indent=2, default=str)
    
    print(f"\nDetailed report saved to: email_cleanup_report.json")

if __name__ == '__main__':
    main()