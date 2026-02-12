#!/bin/bash
# Fix wrangler.toml and deploy

echo "🔧 Fixing wrangler.toml..."

cd ~/.openclaw/workspace/dashboard

# Create clean wrangler.toml
cat > wrangler.toml << 'EOF'
name = "friday-dashboard"
main = "api/worker.js"
compatibility_date = "2024-02-12"

[vars]
ENVIRONMENT = "production"
EOF

echo "✅ wrangler.toml fixed!"
echo ""
echo "🚀 Deploying to Cloudflare..."
wrangler deploy

echo ""
echo "🎉 Done! Check the URL above for your dashboard."