# Koyeb Deployment Guide

## Why Koyeb?
- ✅ Truly free tier (no credit card required)
- ✅ Auto-scaling and zero-downtime deployments
- ✅ Global edge network
- ✅ Git-based deployment
- ✅ Environment variable management

## Prerequisites
- Koyeb account (sign up at https://app.koyeb.com/auth/signup)
- GitHub account connected to Koyeb

## Deployment Steps

### 1. Sign Up & Connect GitHub
1. Go to https://app.koyeb.com/auth/signup
2. Sign up with GitHub (quick OAuth)
3. Authorize Koyeb to access your repositories

### 2. Create New Service
1. Click **"Create Web Service"**
2. Select **"GitHub"** as deployment method
3. Choose your repository: `physical-ai-book`
4. Configure builder:
   - **Branch:** `main`
   - **Build method:** `Dockerfile`
   - **Dockerfile path:** `backend/Dockerfile`
   - **Build context:** `backend`

### 3. Configure Service
**General Settings:**
- **Service name:** `physical-ai-backend`
- **Region:** Singapore (or closest to you)
- **Instance type:** Free (Nano - 512MB RAM)

**Ports:**
- **Port:** `8000`
- **Protocol:** HTTP

**Health Check:**
- **Path:** `/health`
- **Port:** `8000`

**Auto-scaling:**
- **Min instances:** 1
- **Max instances:** 1 (free tier)

### 4. Set Environment Variables
Click **"Environment Variables"** and add:
```
GEMINI_API_KEY=your_gemini_api_key
NEON_DATABASE_URL=your_neon_connection_string
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION_NAME=physical-ai-book
```

**Important:**
- Use "Secret" type for sensitive values
- No quotes needed around values in Koyeb UI

### 5. Deploy
Click "Deploy"
Wait 5-10 minutes for:
- Docker image build
- Model download (sentence-transformers)
- First deployment

### 6. Get Your URL
After deployment completes:
- Your backend will be at: https://physical-ai-backend-[random].koyeb.app
- Copy this URL for frontend configuration

### 7. Verify Deployment
Test your backend:
```bash
curl https://your-app.koyeb.app/health
```
Should return:
```json
{
  "status": "healthy",
  "services": {
    "neon": "connected",
    "qdrant": "connected",
    "gemini": "available"
  }
}
```

### Update Frontend
In `src/components/BookChat.tsx`, change:
```typescript
const BACKEND_URL = "https://physical-ai-backend-[your-id].koyeb.app";
```
Then redeploy frontend:
```bash
npm run build
npm run deploy
```

## Monitoring & Management

### View Logs
1. Go to your service in Koyeb dashboard
2. Click **"Logs"** tab
3. Real-time logs will appear

### Restart Service
1. Go to service settings
2. Click **"Redeploy"**

### Check Status
- Dashboard shows instance status
- Metrics tab shows CPU/Memory usage

### Update Environment Variables
1. Go to service settings
2. Click **"Environment"**
3. Update variables
4. Service will auto-redeploy

## Troubleshooting

### Build Fails
- Check Dockerfile syntax
- Verify requirements.txt has all dependencies
- Check build logs in Koyeb dashboard

### App Crashes on Startup
- Check environment variables are set
- Verify database connections
- Check logs for error messages

### Slow Cold Starts
- First request after inactivity takes ~10s (free tier)
- Subsequent requests are fast

### CORS Errors
- Verify CORS allows your GitHub Pages domain
- Check backend logs for CORS rejections

## Automatic Redeployment

Koyeb automatically redeploys when you:
- Push to `main` branch
- Update environment variables
- Change service configuration

## Cost
- **Free tier:** Completely free, no credit card
- **Limits:**
  - 512MB RAM
  - 1 instance
  - Auto-sleep after 5 mins inactivity
  - Wake on request (~10s delay)

## Support
- Documentation: https://www.koyeb.com/docs
- Community: https://community.koyeb.com
- Status: https://status.koyeb.com