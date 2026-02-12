#!/usr/bin/env python3
"""
Content Generation Inference Script
Generates tweets and content using gathered training data
"""

import json
import random
import os
from pathlib import Path
from datetime import datetime

class ContentGenerator:
    def __init__(self, data_dir="/home/assistant4himanshu/.openclaw/workspace/nlp/data"):
        self.data_dir = Path(data_dir)
        self.training_file = self.data_dir / "training_data.jsonl"
        self.templates_file = self.data_dir / "content_templates.json"
        self.examples = self._load_examples()
        self.templates = self._load_templates()
        
    def _load_examples(self):
        """Load training examples"""
        examples = []
        if self.training_file.exists():
            with open(self.training_file, 'r') as f:
                for line in f:
                    try:
                        examples.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
        return examples
    
    def _load_templates(self):
        """Load content templates"""
        if self.templates_file.exists():
            with open(self.templates_file, 'r') as f:
                return json.load(f)
        return {}
    
    def generate_tweet(self, category=None, style=None):
        """Generate a tweet using examples from the training data"""
        if not self.examples:
            return "No training data available. Run data gathering first."
        
        # Filter by category if specified
        if category:
            filtered = [e for e in self.examples if category in e.get('categories', [])]
            if filtered:
                base = random.choice(filtered)
            else:
                base = random.choice(self.examples)
        else:
            base = random.choice(self.examples)
        
        output = base.get('output', '')
        
        # Simple variations to avoid exact copies
        variations = [
            output,
            self._add_emoji(output),
            self._restructure(output),
            output + " 💪" if 'fitness' in base.get('categories', []) else output
        ]
        
        return random.choice(variations)
    
    def _add_emoji(self, text):
        """Add relevant emojis to text"""
        emojis = ['💪', '🔥', '✨', '🚀', '💯', '⚡', '🎯', '🌟']
        if not any(e in text for e in emojis):
            return text + " " + random.choice(emojis)
        return text
    
    def _restructure(self, text):
        """Simple text restructuring"""
        sentences = text.split('. ')
        if len(sentences) > 1:
            # Swap first and last sentences
            sentences[0], sentences[-1] = sentences[-1], sentences[0]
            return '. '.join(sentences)
        return text
    
    def generate_from_template(self, category):
        """Generate content using a template"""
        if category not in self.templates:
            return self.generate_tweet(category)
        
        template = random.choice(self.templates[category])
        
        # Get examples for this category
        examples = [e for e in self.examples if category in e.get('categories', [])]
        
        if examples:
            example = random.choice(examples)
            return f"Prompt: {template}\nExample response: {example['output']}"
        
        return f"Prompt: {template}"
    
    def generate_content_ideas(self, n=5):
        """Generate multiple content ideas"""
        ideas = []
        categories = list(self.templates.keys()) if self.templates else ['fitness', 'nutrition', 'motivation']
        
        for _ in range(n):
            category = random.choice(categories)
            if self.templates and category in self.templates:
                template = random.choice(self.templates[category])
                ideas.append({
                    'category': category,
                    'prompt': template,
                    'example': self.generate_tweet(category)
                })
            else:
                ideas.append({
                    'category': category,
                    'prompt': f'Create content about {category}',
                    'example': self.generate_tweet(category)
                })
        
        return ideas
    
    def generate_reply(self, context, tone='helpful'):
        """Generate a reply based on context"""
        # Find similar examples
        similar = [e for e in self.examples if any(word in context.lower() 
                   for word in e.get('output', '').lower().split()[:5])]
        
        if similar:
            base = random.choice(similar[:5])
            return base['output']
        
        # Fallback to generic response
        generic_replies = {
            'helpful': [
                "Great question! Consistency is key - start small and build up.",
                "Thanks for sharing! Everyone's journey is different, keep pushing forward.",
                "Love the energy! Remember, progress > perfection."
            ],
            'motivational': [
                "You've got this! Every step counts. 🔥",
                "Don't give up! The results will come. 💪",
                "Believe in yourself and keep going! ✨"
            ],
            'informative': [
                "Here's what worked for me: focus on the basics first.",
                "Research shows consistency beats intensity. Start there!",
                "Great point! Nutrition is 80% of the results."
            ]
        }
        
        return random.choice(generic_replies.get(tone, generic_replies['helpful']))
    
    def batch_generate(self, category=None, count=10):
        """Generate multiple pieces of content"""
        results = []
        for _ in range(count):
            results.append(self.generate_tweet(category))
        return results

if __name__ == "__main__":
    gen = ContentGenerator()
    
    print("=== Content Generation Demo ===\n")
    
    print("1. Random tweet:")
    print(gen.generate_tweet())
    print()
    
    print("2. Fitness tweet:")
    print(gen.generate_tweet('fitness'))
    print()
    
    print("3. Content ideas:")
    ideas = gen.generate_content_ideas(3)
    for idea in ideas:
        print(f"  [{idea['category']}] {idea['prompt']}")
        print(f"  Example: {idea['example'][:80]}...")
        print()
    
    print("4. Reply generation:")
    context = "I'm struggling to stay consistent with my workouts"
    print(f"Context: {context}")
    print(f"Reply: {gen.generate_reply(context, 'motivational')}")
