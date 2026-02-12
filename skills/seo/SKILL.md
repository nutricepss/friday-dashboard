---
name: SEO
description: SEO optimization for Sivola.in Shopify store and NutriCepss content. Focus on product pages, blog content, and local search visibility.
metadata: {"clawdbot":{"emoji":"🔍","requires":{"anyBins":["curl","jq"]},"os":["linux","darwin","win32"]}}
---

# SEO Skill 🔍

## When to Use This Skill ✅

**USE WHEN:**
- Optimizing Sivola.in Shopify product pages
- Writing blog content for NutriCepss website
- Improving local search visibility for coaching services
- Analyzing competitor SEO strategies
- Creating meta descriptions and title tags
- Planning content calendar based on search trends

**DO NOT USE WHEN:**
- Keyword stuffing or black hat techniques
- Creating duplicate content
- Without understanding target audience search intent
- Ignoring mobile optimization

## Security & Boundaries

⚠️ **CRITICAL CONSTRAINTS:**
1. **White Hat Only** - No keyword stuffing, hidden text, or spammy tactics
2. **User-First Content** - SEO should enhance, not detract from user experience
3. **Shopify Limitations** - Work within Shopify's SEO capabilities
4. **Local Focus** - Prioritize "fitness coach in [city]" searches for NutriCepss

## Primary Use Cases

### 1. **Sivola.in Shopify Store**
- Product page optimization
- Collection page SEO
- Blog content for organic traffic
- Technical SEO audits

### 2. **NutriCepss Coaching**
- Local SEO for "fitness coach near me"
- Service page optimization
- Testimonial and review SEO
- Google Business Profile optimization

### 3. **Content Strategy**
- Keyword research for blog topics
- Competitor content analysis
- Trending fitness topics
- Long-tail keyword targeting

## Shopify-Specific SEO

### Product Pages
- **Title**: Brand + Product Name + Key Feature (under 60 chars)
- **Description**: 150-300 words with natural keyword inclusion
- **Images**: Optimized alt text with product keywords
- **URL**: Clean, descriptive slugs with primary keyword

### Collections
- **Title**: Category + "Collection" (e.g., "Workout Gear Collection")
- **Description**: Category overview with related keywords
- **Meta**: Unique meta description for each collection

### Blog Posts
- **Title**: Question or solution-focused (e.g., "How to Choose Protein Powder")
- **Structure**: H1 with question, H2s with answers
- **Length**: 1000-2000 words for comprehensive coverage
- **Internal Links**: Link to relevant products and other posts

## Local SEO for Coaching

### Google Business Profile
- Complete all sections (services, hours, photos)
- Regular posts about offers/success stories
- Encourage client reviews
- Q&A section management

### Service Pages
- Location-specific pages (e.g., "Online Fitness Coaching India")
- Testimonials with location mentions
- Clear call-to-action for consultations

### Content Strategy
- "Fitness tips for [city] residents"
- Local success stories
- Partner with local businesses for backlinks

## Technical Implementation

### Meta Tags (Shopify)
```html
<!-- Title: Keep under 60 characters -->
<title>{{ page_title }}</title>

<!-- Description: 150-160 characters -->
<meta name="description" content="{{ page_description }}">

<!-- Viewport for mobile -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Canonical URL -->
<link rel="canonical" href="{{ canonical_url }}">
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Sivola"
  }
}
```

## Success Metrics

✅ **SEO successful when:**
- Organic traffic increases month-over-month
- Keyword rankings improve for target terms
- Bounce rate decreases, time on page increases
- Conversion rate from organic search improves
- Local search visibility increases

## Common Mistakes to Avoid

❌ **Keyword stuffing** in product descriptions
❌ **Duplicate content** across product variants
❌ **Missing alt text** on product images
❌ **Slow page speed** from unoptimized images
❌ **Thin content** on category pages
❌ **Ignoring mobile optimization**

## Tools & Resources

### Free Tools
- Google Search Console
- Google Analytics
- Google Keyword Planner
- PageSpeed Insights
- Mobile-Friendly Test

### Shopify Apps
- SEO Manager
- Plug in SEO
- Smart SEO
- Crush.pics (image optimization)

---

*General SEO optimization rules continue below...*

## Title Tag
- Keep between 50–60 characters (including spaces and punctuation)
- Place primary keyword within first 30 characters
- Never repeat a keyword in the same title

## Meta Description
- Limit to 150–160 characters or Google truncates it
- Write benefit-focused copy, not feature lists
- End with call-to-action when appropriate

## Header Structure
- Only one H1 per page — H1 contains primary keyword but differs from title
- Follow strict hierarchy: H1 → H2 → H3 (never skip levels)
- Use keyword variations in H2s instead of repeating exact match

## Keyword Placement
- Primary keyword must appear in: title, H1, first 100 words
- Keep keyword density under 3%
- Secondary keywords go in H2 and H3 tags

## Image Optimization
- Alt text on all content images with relevant keywords when natural
- File names use hyphens: `email-tools-comparison.jpg`
- Compress images under 100KB — larger files hurt page speed

## Technical Checks
- Include viewport meta tag for mobile: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Use canonical URLs to prevent duplicate content
- Validate structured data at schema.org/validator before publishing
- Internal links use descriptive anchor text, never "click here"

## Schema Markup
- Article schema for blog posts (include author + datePublished)
- LocalBusiness schema for location-based pages
- Validate JSON-LD before deployment

## Mistakes That Trigger Penalties
- Never hide text with CSS for SEO purposes
- Never use same title tag across multiple pages
- Don't stuff keywords in alt text unnaturally
- Don't use H1 for navigation or logo text
