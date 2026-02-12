#!/usr/bin/env python3
"""
NLP Data Gathering Script for Content Generation
Uses chirp search to gather training data from X/Twitter
"""

import subprocess
import json
import os
import sys
from datetime import datetime
from pathlib import Path

class ChirpDataGatherer:
    def __init__(self, output_dir="/home/assistant4himanshu/.openclaw/workspace/nlp/data"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.raw_data_file = self.output_dir / "raw_tweets.jsonl"
        
    def search_tweets(self, query, limit=50):
        """Search tweets using chirp CLI"""
        try:
            # Use chirp search command
            cmd = ["chirp", "search", query, "--limit", str(limit), "--json"]
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                print(f"Error searching tweets: {result.stderr}")
                return []
            
            # Parse JSON output
            tweets = []
            for line in result.stdout.strip().split('\n'):
                if line:
                    try:
                        tweet = json.loads(line)
                        tweets.append(tweet)
                    except json.JSONDecodeError:
                        continue
            return tweets
            
        except subprocess.TimeoutExpired:
            print("Search timed out")
            return []
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def gather_fitness_content(self):
        """Gather fitness/nutrition related content"""
        queries = [
            "fitness tips",
            "nutrition advice",
            "workout motivation",
            "healthy eating",
            "gym life",
            "weight loss journey",
            "muscle building tips",
            "meal prep ideas"
        ]
        
        all_tweets = []
        for query in queries:
            print(f"Searching: {query}")
            tweets = self.search_tweets(query, limit=30)
            for tweet in tweets:
                tweet['search_query'] = query
                tweet['gathered_at'] = datetime.now().isoformat()
            all_tweets.extend(tweets)
        
        # Save to file
        with open(self.raw_data_file, 'a') as f:
            for tweet in all_tweets:
                f.write(json.dumps(tweet) + '\n')
        
        print(f"Gathered {len(all_tweets)} tweets")
        return len(all_tweets)
    
    def gather_d2c_content(self):
        """Gather D2C brand content"""
        queries = [
            "D2C brand",
            "direct to consumer",
            "startup growth",
            "ecommerce tips",
            " Shopify store"
        ]
        
        all_tweets = []
        for query in queries:
            print(f"Searching: {query}")
            tweets = self.search_tweets(query, limit=20)
            for tweet in tweets:
                tweet['search_query'] = query
                tweet['gathered_at'] = datetime.now().isoformat()
            all_tweets.extend(tweets)
        
        # Save to file
        with open(self.raw_data_file, 'a') as f:
            for tweet in all_tweets:
                f.write(json.dumps(tweet) + '\n')
        
        print(f"Gathered {len(all_tweets)} D2C tweets")
        return len(all_tweets)

if __name__ == "__main__":
    gatherer = ChirpDataGatherer()
    
    print("=== Gathering Fitness Content ===")
    fitness_count = gatherer.gather_fitness_content()
    
    print("\n=== Gathering D2C Content ===")
    d2c_count = gatherer.gather_d2c_content()
    
    print(f"\n=== Total: {fitness_count + d2c_count} tweets gathered ===")
