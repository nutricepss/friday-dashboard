#!/usr/bin/env python3
"""
Training Data Preparation Script
Converts raw tweets into training format for the language model
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime

class TrainingDataPrep:
    def __init__(self, data_dir="/home/assistant4himanshu/.openclaw/workspace/nlp/data"):
        self.data_dir = Path(data_dir)
        self.raw_file = self.data_dir / "raw_tweets.jsonl"
        self.training_file = self.data_dir / "training_data.jsonl"
        
    def clean_text(self, text):
        """Clean tweet text for training"""
        if not text:
            return ""
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        # Remove @mentions for privacy
        text = re.sub(r'@\w+', '@user', text)
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text.strip()
    
    def categorize_tweet(self, tweet):
        """Categorize tweet by intent/topic"""
        text = tweet.get('text', '').lower()
        query = tweet.get('search_query', '').lower()
        
        categories = []
        
        # Fitness categories
        if any(word in text or word in query for word in ['workout', 'gym', 'exercise', 'training']):
            categories.append('fitness')
        if any(word in text or word in query for word in ['nutrition', 'diet', 'meal', 'eating', 'healthy']):
            categories.append('nutrition')
        if any(word in text or word in query for word in ['motivation', 'inspiration', 'mindset']):
            categories.append('motivation')
        if any(word in text or word in query for word in ['weight', 'fat loss', 'cutting']):
            categories.append('weight_loss')
        if any(word in text or word in query for word in ['muscle', 'gain', 'bulking', 'strength']):
            categories.append('muscle_gain')
            
        # Business categories
        if any(word in text or word in query for word in ['d2c', 'direct to consumer', 'startup']):
            categories.append('d2c')
        if any(word in text or word in query for word in ['ecommerce', 'shopify', 'online store']):
            categories.append('ecommerce')
        if any(word in text or word in query for word in ['growth', 'marketing', 'sales']):
            categories.append('growth')
            
        return categories if categories else ['general']
    
    def create_training_example(self, tweet):
        """Create a training example from a tweet"""
        text = self.clean_text(tweet.get('text', ''))
        if not text or len(text) < 20:
            return None
        
        categories = self.categorize_tweet(tweet)
        
        # Create instruction-following format
        instruction = f"Write a tweet about {categories[0].replace('_', ' ')}"
        
        return {
            'instruction': instruction,
            'input': '',
            'output': text,
            'categories': categories,
            'source': 'twitter',
            'created_at': tweet.get('gathered_at', datetime.now().isoformat())
        }
    
    def prepare_training_data(self):
        """Convert raw tweets to training format"""
        if not self.raw_file.exists():
            print(f"Raw data file not found: {self.raw_file}")
            return 0
        
        training_examples = []
        
        with open(self.raw_file, 'r') as f:
            for line in f:
                try:
                    tweet = json.loads(line.strip())
                    example = self.create_training_example(tweet)
                    if example:
                        training_examples.append(example)
                except json.JSONDecodeError:
                    continue
        
        # Write training data
        with open(self.training_file, 'w') as f:
            for example in training_examples:
                f.write(json.dumps(example) + '\n')
        
        print(f"Created {len(training_examples)} training examples")
        
        # Create category summary
        category_counts = {}
        for example in training_examples:
            for cat in example['categories']:
                category_counts[cat] = category_counts.get(cat, 0) + 1
        
        print("\nCategory distribution:")
        for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"  {cat}: {count}")
        
        return len(training_examples)
    
    def create_content_templates(self):
        """Create content generation templates"""
        templates = {
            'fitness': [
                "Share a quick workout tip for busy professionals",
                "What's one exercise everyone should do?",
                "Motivate someone to start their fitness journey"
            ],
            'nutrition': [
                "Share a healthy meal prep idea",
                "What's one nutrition myth to debunk?",
                "Give a simple healthy eating tip"
            ],
            'motivation': [
                "Inspire someone who's struggling with consistency",
                "Share a mindset shift for better results",
                "Motivate someone to push through a plateau"
            ],
            'd2c': [
                "Share a D2C growth strategy",
                "What's one mistake new D2C brands make?",
                "Give advice on building a brand online"
            ],
            'ecommerce': [
                "Share a Shopify optimization tip",
                "What's one way to increase conversions?",
                "Give advice on product photography"
            ]
        }
        
        template_file = self.data_dir / "content_templates.json"
        with open(template_file, 'w') as f:
            json.dump(templates, f, indent=2)
        
        print(f"\nCreated content templates: {template_file}")
        return templates

if __name__ == "__main__":
    prep = TrainingDataPrep()
    
    print("=== Preparing Training Data ===")
    count = prep.prepare_training_data()
    
    print("\n=== Creating Content Templates ===")
    prep.create_content_templates()
    
    print(f"\n=== Done! {count} examples ready ===")
