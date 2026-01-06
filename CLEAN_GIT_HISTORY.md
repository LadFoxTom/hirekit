# Cleaning Git History to Remove Secrets

If you want to completely remove .env files from git history, follow these steps:

## Method 1: Using git filter-branch (Recommended)

```bash
# Remove .env files from entire git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.uat .env.local.temp temp.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (since this rewrites history)
git push origin --force --all
```

## Method 2: Start Fresh (Easiest)

If you don't need the old commit history:

```bash
# Create a new orphan branch (no history)
git checkout --orphan fresh-start

# Add all current files
git add .

# Commit
git commit -m "Initial production commit"

# Force push to main
git branch -M main
git push -u origin main --force
```

## Method 3: Use GitHub's Allow Feature

If the secrets are old test keys:
1. Visit the GitHub links provided in the error message
2. Click "Allow secret" for each one
3. Then push normally

