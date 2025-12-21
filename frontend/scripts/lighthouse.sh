#!/bin/bash

# Lighthouse Performance Audit Script
# Runs comprehensive performance testing and generates report

echo "🚀 NeuroPrep AI - Lighthouse Performance Audit"
echo "================================================"
echo ""

# Check if URL is provided
URL="${1:-http://localhost:3000}"

echo "📍 Target URL: $URL"
echo "🕐 Starting audit..."
echo ""

# Run Lighthouse CLI
npx lighthouse "$URL" \
  --preset=desktop \
  --view \
  --output=html \
  --output-path=./lighthouse-report.html \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo \
  --throttling-method=simulate \
  --throttling.cpuSlowdownMultiplier=1 \
  --quiet

echo ""
echo "✅ Audit Complete!"
echo "📊 Report saved to: ./lighthouse-report.html"
echo ""

# Extract score (requires jq, optional)
if command -v jq &> /dev/null; then
  PERF_SCORE=$(npx lighthouse "$URL" --output=json --output-path=stdout --quiet --chrome-flags="--headless --no-sandbox" 2>/dev/null | jq '.categories.performance.score * 100')
  echo "⚡ Performance Score: $PERF_SCORE/100"
else
  echo "💡 Tip: Install 'jq' to see scores in terminal"
fi

echo ""
echo "🎯 Target for Hackathon: 100/100 Performance"
