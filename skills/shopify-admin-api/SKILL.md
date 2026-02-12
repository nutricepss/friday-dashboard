---
name: shopify-admin-api
description: Manage Sivola.in Shopify store: products, orders, customers, inventory. Full Admin API access for store operations and analytics.
metadata: {"openclaw":{"emoji":"🛍️","requires":{"bins":["curl","jq"]}}}
---

# Shopify Admin API Skill 🛍️

## When to Use This Skill ✅

**USE WHEN:**
- Managing Sivola.in product catalog and inventory
- Processing orders and fulfillments
- Analyzing customer data and sales trends
- Updating product descriptions and SEO
- Generating sales reports and analytics
- Managing collections and navigation

**DO NOT USE WHEN:**
- Access token is not configured (PENDING)
- Making bulk changes without testing first
- During peak sales periods without caution
- Without understanding Shopify rate limits
- Sharing customer personal data

## Security & Boundaries

⚠️ **CRITICAL CONSTRAINTS:**
1. **Store**: sivola.in (access token PENDING - needs setup)
2. **Rate Limits**: 40 requests/10 seconds (bucket), 2 requests/second (leaky bucket)
3. **Customer Data**: Handle PII (Personal Identifiable Information) with extreme care
4. **Production Caution**: Test changes in development store first if available

## Current Status

🚨 **ACCESS TOKEN PENDING**
- Shopify Admin API access token not yet configured
- Need to create custom app in Shopify admin
- Required for all API operations
- Store: sivola.in

## Primary Use Cases for Sivola.in

### 1. **Product Management**
- Add/update product descriptions with SEO optimization
- Manage inventory levels and variants
- Update pricing and compare at prices
- Organize products into collections

### 2. **Order Processing**
- View and process new orders
- Update fulfillment status
- Handle refunds and returns
- Generate shipping labels (if integrated)

### 3. **Customer Insights**
- Analyze customer purchase history
- Segment customers for marketing
- Track customer lifetime value
- Identify repeat purchase patterns

### 4. **Analytics & Reporting**
- Daily sales reports
- Product performance analysis
- Traffic and conversion tracking
- Inventory turnover rates

## Configuration Needed

### 1. **Access Token Setup**
```bash
# Steps to configure:
# 1. Go to sivola.in/admin
# 2. Settings > Apps and sales channels
# 3. Develop apps > Create app
# 4. Configure API scopes
# 5. Install app > Copy access token
# 6. Set environment variables:

export SHOPIFY_STORE_DOMAIN="sivola.in"
export SHOPIFY_ACCESS_TOKEN="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
```

### 2. **Required API Scopes**
- `read_products`, `write_products`
- `read_orders`, `write_orders`
- `read_customers`
- `read_inventory`, `write_inventory`

## Workflow Templates

### Daily Store Check
```bash
# Check recent orders
curl -s -H "X-Shopify-Access-Token: $SHOPIFY_ACCESS_TOKEN" \
  "https://$SHOPIFY_STORE_DOMAIN/admin/api/2024-10/orders.json?status=open&limit=5"

# Check low inventory
curl -s -H "X-Shopify-Access-Token: $SHOPIFY_ACCESS_TOKEN" \
  "https://$SHOPIFY_STORE_DOMAIN/admin/api/2024-10/inventory_levels.json?limit=10"
```

### Product SEO Update
```bash
# Update product description with SEO optimization
curl -X PUT -H "X-Shopify-Access-Token: $SHOPIFY_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "id": 123456789,
      "body_html": "<p>Optimized product description with keywords...</p>",
      "metafields": [
        {
          "key": "description_tag",
          "value": "SEO-optimized meta description",
          "type": "single_line_text_field",
          "namespace": "global"
        }
      ]
    }
  }' \
  "https://$SHOPIFY_STORE_DOMAIN/admin/api/2024-10/products/123456789.json"
```

### Sales Report Generation
```bash
# Get yesterday's orders
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
curl -s -H "X-Shopify-Access-Token: $SHOPIFY_ACCESS_TOKEN" \
  "https://$SHOPIFY_STORE_DOMAIN/admin/api/2024-10/orders.json?created_at_min=${YESTERDAY}&status=any"
```

## Error Handling

**Common Issues:**
- `401 Unauthorized`: Invalid or expired access token
- `429 Too Many Requests`: Rate limit exceeded
- `404 Not Found`: Resource doesn't exist
- `422 Unprocessable Entity`: Invalid data in request

**Rate Limit Handling:**
- 40 requests per 10 seconds (bucket)
- 2 requests per second (leaky bucket)
- Implement exponential backoff for retries
- Track request counts in memory

**Fallback Actions:**
1. Log error details to memory file
2. Wait 10 seconds before retry (rate limits)
3. Notify Himanshu for token refresh if 401
4. Use cached data if API unavailable

## Success Criteria

✅ **Skill executed successfully when:**
- API calls return 200/201 status codes
- Data retrieved or updated correctly
- Rate limits respected
- Customer data handled securely
- Actions logged for audit trail

## Negative Examples

❌ **WRONG:** Exposing customer PII in logs
❌ **WRONG:** Ignoring rate limits
❌ **WRONG:** Making production changes without testing
❌ **WRONG:** Sharing access tokens

✅ **CORRECT:** Using environment variables for tokens
✅ **CORRECT:** Implementing rate limit backoff
✅ **CORRECT:** Testing in development first
✅ **CORRECT:** Logging actions without sensitive data

## Integration with Other Skills

### SEO → Shopify
- Optimize product descriptions and meta tags
- Update collection page SEO
- Blog content integration

### Email → Shopify
- Order confirmation emails
- Abandoned cart recovery
- Customer follow-up sequences

### Analytics → Shopify
- Sales performance tracking
- Customer behavior analysis
- Inventory optimization

## Next Steps

1. **Priority**: Configure Shopify access token for sivola.in
2. **Test**: Start with read-only operations first
3. **Monitor**: Track API usage and rate limits
4. **Automate**: Set up daily reports and alerts

**Note**: Full API documentation available in `skill.md` file (23K+ lines).