# Railway.app Deployment Guide

## Prerequisites
- Railway account: https://railway.app
- GitHub account
- Credit card (Railway gives $5 free credit monthly)

## Step-by-Step Deployment

### 1. Sign Up for Railway
1. Go to https://railway.app
2. Click "Login" → "Sign in with GitHub"
3. Authorize Railway to access your repositories
4. Add credit card (required, but you get $5/month free)

### 2. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `physical-ai-book`
4. Railway will detect the repo

### 3. Configure Service Settings

**CRITICAL: Set Root Directory**
1. Click on the deployed service
2. Go to "Settings" tab
3. Find "Root Directory"
4. Set to: `backend`
5. Click "Save"

**Port Configuration:**
- Railway auto-detects port from your code
- Ensure app uses `$PORT` environment variable

**Build Command:**
- Leave as default (Railway auto-detects)
- Or set to: `pip install -r requirements.txt`

**Start Command:**
- Railway auto-detects from Procfile
- Or manually set: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 4. Set Environment Variables
1. Go to "Variables" tab
2. Click "New Variable" for each:

```
GEMINI_API_KEY=your_gemini_key
NEON_DATABASE_URL=your_neon_url
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_key
QDRANT_COLLECTION_NAME=physical-ai-book
PORT=8000
```

**Important:**
- Use "Add Variable" button for each
- No quotes around values
- Mark sensitive variables as "private"

### 5. Deploy
- Railway auto-deploys on every push to main
- First deployment takes 5-10 minutes
- Watch logs in "Deployments" tab

### 6. Get Your URL
1. Go to "Settings" tab
2. Under "Domains" click "Generate Domain"
3. Your URL: https://[app-name].up.railway.app
4. Copy this URL

### 7. Verify Deployment
```bash
curl https://your-app.up.railway.app/health
```

Should return:
```json
{"status": "healthy", "services": {...}}
```

### 8. Update Frontend
In src/components/BookChat.tsx:
```typescript
const BACKEND_URL = "https://your-app.up.railway.app";
```

Redeploy frontend:
```bash
npm run build
npm run deploy
```

## Troubleshooting

### "Size too large" Error
- Check backend/ folder size: `du -sh backend/`
- Should be under 100MB (excluding node_modules)
- Ensure .dockerignore excludes frontend files

### Permission Errors
- Dockerfile uses non-root user
- Railway handles permissions automatically
- Check logs for specific permission issues

### Build Fails
- Check "Logs" tab in Railway
- Common issues:
  - Wrong root directory (must be backend)
  - Missing dependencies in requirements.txt
  - Environment variables not set

### App Crashes on Start
- Verify all environment variables are set
- Check database connection strings
- Review startup logs

### CORS Errors
- Ensure CORS allows Railway domain
- Check backend logs for blocked requests

## Monitoring
- Logs: Real-time in "Logs" tab
- Metrics: CPU/Memory in "Metrics" tab
- Deployments: History in "Deployments" tab

## Cost Management
- Free tier: $5 credit per month
- Usage: ~$3-4/month for this app
- Monitor in "Usage" tab
- Set up usage alerts

## Auto-Redeploy
Railway automatically redeploys when:
- You push to main branch
- You change environment variables
- You update service settings

## Useful Commands
```bash
# Check deployment status
railway status

# View logs
railway logs

# Open in browser
railway open
```