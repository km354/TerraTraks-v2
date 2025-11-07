#!/bin/bash
# Helper script to commit and push changes to GitHub

# Get commit message from argument or use default
COMMIT_MSG="${1:-Auto-commit: Update project files}"

# Add all changes
git add .

# Commit with message
git commit -m "$COMMIT_MSG"

# Try to push to GitHub
if git push origin main 2>&1; then
    echo "✅ Successfully committed and pushed to GitHub!"
else
    echo "⚠️  Commit successful, but push failed. Authentication may be required."
    echo "   Your changes are saved locally. Run 'git push origin main' manually when ready."
fi

