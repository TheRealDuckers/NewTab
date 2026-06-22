# 🚀 Deploy to GitHub Pages - Complete Guide

## Step 1: Get Your Files to GitHub

### Option A: Download and Upload (Easiest for Mobile)

1. **Download your project files** from Figma Make
2. **Unzip** the downloaded folder
3. **Go to GitHub.com** and create a new repository
   - Repository name: `new-tab-page` (or any name you like)
   - Make it **Public**
   - Don't initialize with README
4. **Upload files:**
   - Click "uploading an existing file"
   - Drag all files (including the `.github` folder if visible)
   - Make sure to upload the `.github/workflows/deploy-gh-pages.yml` file
   - Commit directly to `main`

### Option B: Using Git (Desktop)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Step 2: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in left sidebar)
3. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**
4. Click **Save**

## Step 3: That's It! 

The GitHub Action will automatically:
- ✅ Run when you push to `main`
- ✅ Install dependencies with pnpm
- ✅ Build your project
- ✅ Deploy to `gh-pages` branch
- ✅ Make it live on GitHub Pages

## Step 4: Access Your Site

Your site will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME
```

Example: `https://john-doe.github.io/new-tab-page`

## Monitoring Deployment

1. Go to **Actions** tab in your repository
2. Watch the deployment progress:
   - 🟡 In progress
   - ✅ Success
   - ❌ Failed

First deployment takes 2-5 minutes.

## What the Workflow Does

The `.github/workflows/deploy-gh-pages.yml` file:

```yaml
1. Triggers on push to main branch (or manual trigger)
2. Sets up Node.js 20
3. Installs pnpm
4. Runs pnpm install
5. Runs pnpm run build
6. Deploys dist folder to gh-pages branch
```

## Updating Your Site

Every time you push to `main`, it automatically redeploys!

```bash
# Make changes to your files
git add .
git commit -m "Update design"
git push
# Wait 2-3 minutes, site is updated!
```

## Important Files for GitHub Pages

Make sure these are in your repository:

```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy-gh-pages.yml  ← Deployment automation
├── src/
│   └── app/
│       └── App.tsx               ← Your main app
├── package.json                  ← Dependencies
├── vite.config.ts               ← Build config (base: './')
└── index.html                   ← Entry point
```

## Troubleshooting

### ❌ Workflow Fails
- Check Actions tab for error logs
- Ensure `package.json` has `"build": "vite build"` script
- Repository must be **public** (or you need GitHub Pro for private)

### ⚠️ Blank Page
- Wait 5 minutes for first deployment
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console (F12) for errors
- Verify `vite.config.ts` has `base: './'`

### 🔧 404 Errors
- Ensure Pages is enabled in Settings
- Source should be `gh-pages` branch
- Wait a few minutes after first deployment

### 📁 Can't Find .github Folder
- On mobile: It might be hidden
- Make sure when uploading, you include the folder structure
- Or create it manually in GitHub:
  1. Click "Add file" → "Create new file"
  2. Type: `.github/workflows/deploy-gh-pages.yml`
  3. Paste the workflow content (see below)

## Manual Workflow File

If you need to create it manually in GitHub web interface:

**File path:** `.github/workflows/deploy-gh-pages.yml`

**Content:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
```

## Using as Browser New Tab

Once live, set it as your new tab:

### Chrome
1. Install extension: **Custom New Tab URL**
2. Set URL to your GitHub Pages link

### Firefox  
1. Install extension: **New Tab Override**
2. Set URL to your GitHub Pages link

### Edge
1. Install extension: **Custom New Tab**
2. Set URL to your GitHub Pages link

---

**Questions?**
- Check the Actions tab for deployment logs
- Ensure repository is public
- Verify all files uploaded correctly
- Wait a few minutes for first deployment

Enjoy your custom new tab page! 🎉
