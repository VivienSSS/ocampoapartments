#!/bin/bash

REPO="VivienSSS/ocampoapartments"
ISSUES_DIR="docs/issues"

get_field() {
    grep "^$1:" "$2" | sed "s/^$1: //" | tr -d "[]'\""
}

for file in $ISSUES_DIR/*.md; do
    title=$(get_field "title" "$file")
    
    # Extract body: skip YAML front matter, get everything until end of file
    body=$(awk '/^---$/,/^---$/ {next} {print}' "$file")
    
    # Create issue with title, full body, and labels
    gh issue create \
        --title "$title" \
        --body "$body" \
        --label "feature" \
        --repo "$REPO"
    
    echo "✓ Created: $title"
done
