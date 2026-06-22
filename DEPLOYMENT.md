# GitHub Pages Deployment Guide

Your new tab page is ready to deploy to GitHub Pages! Follow these steps:

## Prerequisites
- A GitHub account
- Git installed on your computer
- Node.js and npm installed

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `new-tab-page` or `custom-browser-tab`
3. Don't initialize with README (we already have code)

## Step 2: Configure Your Project

Before deploying, you need to update two files with your repository information:

### Update `package.json`
Replace `{username}` and `{repo-name}` in the homepage field:
```json
"homepage": "https://yourusername.github.io/your-repo-name"
```

### Update `vite.config.ts`
Replace `{repo-name}` in the base field:
```typescript
base: '/your-repo-name/'
```

**Example:**
- If your GitHub username is `john-doe` 
- And your repo name is `new-tab-page`
- Then:
  - `package.json`: `"homepage": "https://john-doe.github.io/new-tab-page"`
  - `vite.config.ts`: `base: '/new-tab-page/'`

## Step 3: Initialize Git and Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit: New tab page with weather and glassmorphism"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to GitHub Pages

```bash
# Deploy (this will build and publish to gh-pages branch)
npm run deploy
```

This command will:
1. Build your project (`npm run build`)
2. Create/update the `gh-pages` branch
3. Push the built files to GitHub Pages

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll down to **Pages** (in the left sidebar)
4. Under **Source**, select `gh-pages` branch
5. Click **Save**

## Step 6: Access Your Site

After a few minutes, your site will be live at:
```
https://yourusername.github.io/your-repo-name
```

## Updating Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
npm run deploy
```

## Using as Browser New Tab

Once deployed, you can:

1. **Set as Homepage:** Go to your browser settings and set the GitHub Pages URL as your homepage
2. **Use an Extension:** Install a "Custom New Tab URL" extension and point it to your GitHub Pages URL
3. **Bookmark It:** Add it to your bookmarks bar for quick access

## Troubleshooting

### Blank page after deployment
- Make sure you updated both `package.json` and `vite.config.ts` with the correct repo name
- Check the browser console for errors
- Verify the `gh-pages` branch exists in your repository

### 404 errors
- Ensure GitHub Pages is enabled in repository settings
- Wait a few minutes for changes to propagate
- Check that the base path in `vite.config.ts` matches your repo name

### Weather not working
- The weather API (Open-Meteo) doesn't require an API key and should work from any domain
- Check your browser's console for any CORS or network errors

## Need Help?

- Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
- Ensure your repository is public (GitHub Pages free tier requires public repos)
- Verify all file paths and URLs are correct

Enjoy your new custom tab page! 🎉
