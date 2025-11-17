#!/bin/bash

REPO="VivienSSS/ocampoapartments"
ISSUES_DIR="docs/issues"

get_field() {
    grep "^$1:" "$2" | sed "s/^$1: //" | tr -d "[]'\""
}

for file in $ISSUES_DIR/*.md; do
    title=$(get_field "title" "$file")
    about=$(get_field "about" "$file")
    
    # Create issue with title, brief description from 'about', and labels
    gh issue create \
        --title "$title" \
        --body "$about" \
        --label "feature" \
        --repo "$REPO"
    
    echo "✓ Created: $title"
done
