#!/usr/bin/env python3
"""
Master NLP Pipeline Script
Orchestrates data gathering, training prep, and content generation
"""

import subprocess
import sys
import os
from pathlib import Path
from datetime import datetime

class NLPPipeline:
    def __init__(self):
        self.workspace = Path("/home/assistant4himanshu/.openclaw/workspace/nlp")
        self.scripts_dir = self.workspace / "scripts"
        self.data_dir = self.workspace / "data"
        
    def run_step(self, name, script_name):
        """Run a pipeline step"""
        print(f"\n{'='*60}")
        print(f"STEP: {name}")
        print(f"{'='*60}")
        
        script = self.scripts_dir / script_name
        result = subprocess.run(
            [sys.executable, str(script)],
            capture_output=False,
            text=True
        )
        
        if result.returncode != 0:
            print(f"❌ Step failed: {name}")
            return False
        print(f"✅ Step completed: {name}")
        return True
    
    def gather_data(self):
        """Step 1: Gather data from X/Twitter"""
        return self.run_step("Data Gathering", "gather_data.py")
    
    def prepare_training_data(self):
        """Step 2: Prepare training data"""
        return self.run_step("Training Data Preparation", "prepare_training_data.py")
    
    def test_generation(self):
        """Step 3: Test content generation"""
        return self.run_step("Content Generation Test", "generate_content.py")
    
    def full_pipeline(self):
        """Run the complete pipeline"""
        print(f"\n🚀 Starting NLP Pipeline at {datetime.now().isoformat()}")
        print(f"Workspace: {self.workspace}")
        
        steps = [
            ("Data Gathering", "gather_data.py"),
            ("Training Data Preparation", "prepare_training_data.py"),
            ("Content Generation Test", "generate_content.py")
        ]
        
        for name, script in steps:
            if not self.run_step(name, script):
                print(f"\n❌ Pipeline failed at: {name}")
                return False
        
        print(f"\n{'='*60}")
        print("✅ NLP Pipeline Complete!")
        print(f"{'='*60}")
        print(f"\nNext steps:")
        print("1. Review training data: cat nlp/data/training_data.jsonl")
        print("2. Generate content: python nlp/scripts/generate_content.py")
        print("3. Use in your workflow via sessions_spawn")
        return True
    
    def quick_generate(self, category=None, count=5):
        """Quick content generation without full pipeline"""
        from generate_content import ContentGenerator
        
        gen = ContentGenerator()
        
        print(f"\n📝 Generating {count} content pieces...")
        print(f"Category: {category or 'mixed'}\n")
        
        for i in range(count):
            content = gen.generate_tweet(category)
            print(f"{i+1}. {content}\n")
        
        return True

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="NLP Pipeline for Content Generation")
    parser.add_argument("command", choices=["full", "gather", "prepare", "test", "generate"],
                       help="Pipeline command to run")
    parser.add_argument("--category", help="Category for generation (fitness, nutrition, etc.)")
    parser.add_argument("--count", type=int, default=5, help="Number of items to generate")
    
    args = parser.parse_args()
    
    pipeline = NLPPipeline()
    
    if args.command == "full":
        pipeline.full_pipeline()
    elif args.command == "gather":
        pipeline.gather_data()
    elif args.command == "prepare":
        pipeline.prepare_training_data()
    elif args.command == "test":
        pipeline.test_generation()
    elif args.command == "generate":
        pipeline.quick_generate(args.category, args.count)
