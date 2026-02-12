# NLP Content Generation System

A lightweight NLP pipeline for generating fitness, nutrition, and D2C content using real-world data from X/Twitter.

## Architecture

```
nlp/
├── data/
│   ├── raw_tweets.jsonl          # Gathered from X/Twitter
│   ├── training_data.jsonl       # Processed training examples
│   └── content_templates.json    # Content generation templates
├── scripts/
│   ├── gather_data.py            # Data gathering from X
│   ├── prepare_training_data.py  # Training data preparation
│   ├── generate_content.py       # Content generation inference
│   └── pipeline.py               # Master orchestration script
└── models/                       # (Future: Fine-tuned models)
```

## Quick Start

### 1. Run Full Pipeline
```bash
cd /home/assistant4himanshu/.openclaw/workspace/nlp
python scripts/pipeline.py full
```

### 2. Generate Content Immediately
```bash
# Generate 5 random content pieces
python scripts/pipeline.py generate

# Generate fitness-specific content
python scripts/pipeline.py generate --category fitness --count 10
```

### 3. Individual Steps
```bash
# Only gather data
python scripts/pipeline.py gather

# Only prepare training data
python scripts/pipeline.py prepare

# Only test generation
python scripts/pipeline.py test
```

## Usage in Workflows

### From OpenClaw Sessions
```python
# Spawn content generation sub-agent
sessions_spawn(
    task="Generate 5 fitness tweets using nlp/scripts/generate_content.py",
    agentId="content"
)
```

### Direct Script Usage
```python
from nlp.scripts.generate_content import ContentGenerator

gen = ContentGenerator()

# Generate single tweet
tweet = gen.generate_tweet(category='fitness')

# Generate reply
reply = gen.generate_reply("I'm struggling with meal prep", tone='helpful')

# Batch generate
ideas = gen.generate_content_ideas(n=10)
```

## Categories Supported

- **fitness** - Workouts, gym tips, exercise motivation
- **nutrition** - Meal ideas, diet tips, healthy eating
- **motivation** - Mindset, consistency, inspiration
- **weight_loss** - Fat loss, cutting, transformation
- **muscle_gain** - Bulking, strength, hypertrophy
- **d2c** - Direct-to-consumer business advice
- **ecommerce** - Shopify, online store optimization
- **growth** - Marketing, sales, business growth

## Data Flow

1. **Gather** (`gather_data.py`)
   - Uses `chirp search` to query X/Twitter
   - Searches fitness, nutrition, D2C topics
   - Stores raw tweets in `data/raw_tweets.jsonl`

2. **Prepare** (`prepare_training_data.py`)
   - Cleans and categorizes tweets
   - Creates instruction-following format
   - Generates content templates
   - Outputs to `data/training_data.jsonl`

3. **Generate** (`generate_content.py`)
   - Loads training examples
   - Generates variations using templates
   - Supports category-specific generation
   - Provides reply suggestions

## Cost Optimization

- **Data gathering**: Uses `chirp` CLI (one-time setup, then free)
- **Storage**: Local JSONL files (minimal cost)
- **Inference**: Uses example-based generation (no API calls)
- **Future**: Can add OpenClaw model inference via `sessions_spawn`

## Integration with OpenClaw

### As a Sub-Agent Task
```python
sessions_spawn(
    task="""
    Generate content for Instagram:
    1. Run: python nlp/scripts/generate_content.py
    2. Pick 3 best fitness tweets
    3. Format as Instagram captions with hashtags
    4. Save to memory/content_queue.md
    """,
    agentId="content"
)
```

### As a Skill
Create `skills/nlp-content/` with:
- `SKILL.md` - Documentation
- `scripts/` - Wrapper scripts
- Integration with main agent

## Future Enhancements

1. **Fine-tuned Models**
   - Train custom model on gathered data
   - Use OpenClaw's local model support

2. **Advanced Search**
   - Reddit data via `reddit-readonly`
   - Instagram caption scraping
   - Trending topic detection

3. **Content Calendar**
   - Scheduled generation via cron
   - Auto-posting to social platforms
   - Performance tracking

4. **Multi-Modal**
   - Image caption generation
   - Video script writing
   - Carousel post creation

## Monitoring

Check data volume:
```bash
wc -l nlp/data/*.jsonl
ls -lh nlp/data/
```

Review generated content:
```bash
python nlp/scripts/generate_content.py | head -20
```

## Security Notes

- API key stored in `~/.openclaw/credentials/` with 600 permissions
- No PII stored in training data
- @mentions sanitized to @user
- URLs removed from training text

## Troubleshooting

**No training data found**
```bash
# Run data gathering first
python nlp/scripts/gather_data.py
```

**chirp command not found**
```bash
# Ensure chirp skill is installed
openclaw skills install chirp
```

**Empty generation results**
```bash
# Check if training data exists
head nlp/data/training_data.jsonl
```

## Support

For issues or enhancements, check:
- `memory/hubfit-api-map.md` for API patterns
- `TOOLS.md` for available tools
- OpenClaw docs: `/docs/channels/whatsapp.md`
