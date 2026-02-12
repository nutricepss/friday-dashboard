#!/usr/bin/env python3
import os
import sys
import imaplib
import email
import json
from email.header import decode_header
from datetime import datetime, timedelta

def get_creds(account_key):
    """Get credentials for specific account"""
    with open('/home/assistant4himanshu/.openclaw/credentials/gmail-app-passwords.json', 'r') as f:
        creds = json.load(f)
    
    account = creds['accounts'].get(account_key)
    if not account:
        print(f"Account {account_key} not found")
        return None, None
    
    return account['user'], account['pass']

def clean_spam_for_account(account_key):
    """Clean spam folder for a specific account"""
    user, password = get_creds(account_key)
    if not user:
        return 0
    
    print(f"\nCleaning spam for: {account_key} ({user})")
    
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(user, password)
        
        # Try different spam folder names
        spam_folders = ['[Gmail]/Spam', 'Spam', 'Junk', '[Gmail]/Junk']
        deleted_count = 0
        
        for folder in spam_folders:
            try:
                status, folder_info = mail.select(folder)
                if status == 'OK':
                    print(f"  Found spam folder: {folder}")
                    
                    # Get all messages
                    status, messages = mail.search(None, 'ALL')
                    if status == 'OK':
                        email_ids = messages[0].split()
                        spam_count = len(email_ids)
                        
                        if spam_count > 0:
                            print(f"  Found {spam_count} emails in spam")
                            
                            # Mark for deletion
                            for email_id in email_ids:
                                mail.store(email_id, '+FLAGS', '\\Deleted')
                            
                            # Expunge to delete
                            mail.expunge()
                            deleted_count += spam_count
                            print(f"  Deleted {spam_count} emails")
                    
                    # Close folder
                    mail.close()
            except Exception as e:
                # Try next folder
                continue
        
        mail.logout()
        return deleted_count
        
    except Exception as e:
        print(f"  Error: {e}")
        return 0

def analyze_newsletters_for_account(account_key, limit=50):
    """Analyze newsletters in inbox"""
    user, password = get_creds(account_key)
    if not user:
        return {}
    
    print(f"\nAnalyzing newsletters for: {account_key} ({user})")
    
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(user, password)
        mail.select("inbox")
        
        # Search for emails from last 30 days
        date_cutoff = (datetime.now() - timedelta(days=30)).strftime('%d-%b-%Y')
        status, messages = mail.search(None, f'(SINCE "{date_cutoff}")')
        
        newsletters = {}
        
        if status == 'OK':
            email_ids = messages[0].split()
            print(f"  Found {len(email_ids)} emails in last 30 days")
            
            # Analyze first N emails
            for i, e_id in enumerate(email_ids[:limit]):
                try:
                    _, msg_data = mail.fetch(e_id, "(RFC822)")
                    for response_part in msg_data:
                        if isinstance(response_part, tuple):
                            msg = email.message_from_bytes(response_part[1])
                            
                            # Get sender and subject
                            from_header = msg.get("From", "")
                            subject_header = msg.get("Subject", "")
                            
                            # Decode subject
                            if subject_header:
                                subject, encoding = decode_header(subject_header)[0]
                                if isinstance(subject, bytes):
                                    subject = subject.decode(encoding if encoding else "utf-8")
                            else:
                                subject = ""
                            
                            # Check if it looks like a newsletter
                            from_lower = from_header.lower()
                            subject_lower = subject.lower()
                            
                            newsletter_indicators = [
                                'newsletter', 'digest', 'weekly', 'daily', 'roundup',
                                'substack', 'beehiiv', 'convertkit', 'mailchimp',
                                'medium', 'linkedin', 'producthunt', 'hackernews'
                            ]
                            
                            is_newsletter = False
                            for indicator in newsletter_indicators:
                                if indicator in from_lower or indicator in subject_lower:
                                    is_newsletter = True
                                    break
                            
                            # Also check for List-Unsubscribe header
                            if msg.get('List-Unsubscribe'):
                                is_newsletter = True
                            
                            if is_newsletter:
                                if from_header not in newsletters:
                                    newsletters[from_header] = {
                                        'count': 0,
                                        'subjects': [],
                                        'has_list_unsubscribe': False
                                    }
                                
                                newsletters[from_header]['count'] += 1
                                newsletters[from_header]['subjects'].append(subject[:100])
                                
                                if msg.get('List-Unsubscribe'):
                                    newsletters[from_header]['has_list_unsubscribe'] = True
                except Exception as e:
                    continue
        
        mail.logout()
        return newsletters
        
    except Exception as e:
        print(f"  Error: {e}")
        return {}

def select_best_newsletter(all_newsletters):
    """Select the most valuable newsletter"""
    if not all_newsletters:
        return None
    
    scored = []
    
    for sender, data in all_newsletters.items():
        score = 0
        
        # Frequency score
        score += min(data['count'] * 2, 20)
        
        # Content relevance (fitness/health/business)
        sender_lower = sender.lower()
        fitness_keywords = ['fitness', 'health', 'nutrition', 'wellness', 'exercise', 'workout']
        business_keywords = ['business', 'marketing', 'entrepreneur', 'startup', 'growth']
        
        for keyword in fitness_keywords:
            if keyword in sender_lower:
                score += 15
                break
        
        for keyword in business_keywords:
            if keyword in sender_lower:
                score += 10
                break
        
        # Check subjects for relevance
        relevant_subjects = 0
        for subject in data['subjects']:
            subject_lower = subject.lower()
            if any(keyword in subject_lower for keyword in fitness_keywords + business_keywords):
                relevant_subjects += 1
        
        score += min(relevant_subjects * 3, 15)
        
        # Reputable sources
        reputable_domains = ['substack.com', 'medium.com', 'linkedin.com']
        for domain in reputable_domains:
            if domain in sender_lower:
                score += 5
                break
        
        scored.append({
            'sender': sender,
            'count': data['count'],
            'subjects': data['subjects'][:3],
            'score': score
        })
    
    scored.sort(key=lambda x: x['score'], reverse=True)
    return scored[0] if scored else None

def main():
    print("=" * 60)
    print("GMAIL CLEANUP & NEWSLETTER ANALYSIS")
    print("=" * 60)
    
    accounts = ['work', 'personal', 'swansh', 'assistant', 'nutricepss0']
    
    total_spam_deleted = 0
    all_newsletters = {}
    
    for account in accounts:
        # Clean spam
        spam_deleted = clean_spam_for_account(account)
        total_spam_deleted += spam_deleted
        
        # Analyze newsletters
        newsletters = analyze_newsletters_for_account(account, limit=30)
        all_newsletters.update(newsletters)
        
        if newsletters:
            print(f"  Found {len(newsletters)} newsletter senders")
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total spam emails deleted: {total_spam_deleted}")
    print(f"Total newsletter senders identified: {len(all_newsletters)}")
    
    # Select best newsletter
    print("\n" + "=" * 60)
    print("NEWSLETTER RECOMMENDATION")
    print("=" * 60)
    
    best = select_best_newsletter(all_newsletters)
    
    if best:
        print(f"\n🎯 RECOMMENDED DAILY NEWSLETTER:")
        print(f"   Sender: {best['sender']}")
        print(f"   Frequency: {best['count']} emails in last 30 days")
        print(f"   Sample subjects:")
        for i, subject in enumerate(best['subjects'], 1):
            print(f"     {i}. {subject}")
        
        print(f"\n   WHY RECOMMENDED:")
        print(f"   • Regular content delivery ({best['count']} times/month)")
        
        # Check content type
        sender_lower = best['sender'].lower()
        if any(keyword in sender_lower for keyword in ['fitness', 'health', 'nutrition']):
            print(f"   • Directly relevant to Himanshu's fitness coaching business")
            print(f"   • Provides industry insights and trends")
        elif any(keyword in sender_lower for keyword in ['business', 'marketing']):
            print(f"   • Supports business growth and marketing strategies")
            print(f"   • Valuable for scaling the coaching practice")
        
        print(f"   • Daily reading habit builds knowledge consistently")
    else:
        print("\nNo newsletters found to recommend.")
        print("Consider subscribing to:")
        print("  • Fitness/health industry newsletters")
        print("  • Business/marketing newsletters for coaches")
        print("  • Nutrition science updates")
    
    # Save report
    report = {
        'timestamp': datetime.now().isoformat(),
        'total_spam_deleted': total_spam_deleted,
        'newsletter_senders_count': len(all_newsletters),
        'recommended_newsletter': best,
        'all_newsletters': list(all_newsletters.keys())[:10]  # First 10 only
    }
    
    with open('email_cleanup_report_simple.json', 'w') as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\nReport saved to: email_cleanup_report_simple.json")

if __name__ == "__main__":
    main()