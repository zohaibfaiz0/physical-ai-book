# Railway Deployment Checklist

## Pre-Deployment
- [ ] Signed up for Railway.app
- [ ] Added credit card (gets $5 free credit)
- [ ] Connected GitHub account
- [ ] Committed all changes to main branch
- [ ] Verified backend/ size under 100MB

## Railway Configuration
- [ ] Created new project from GitHub
- [ ] Set Root Directory to `backend`
- [ ] Generated Railway domain
- [ ] Added all 5 environment variables
- [ ] Environment variables marked as private

## During Deployment
- [ ] Build completed successfully
- [ ] No size errors in logs
- [ ] No permission errors
- [ ] Service shows as "Active"
- [ ] Health check passes

## Post-Deployment
- [ ] /health endpoint returns 200
- [ ] /chat endpoint works
- [ ] CORS configured correctly
- [ ] Updated frontend BACKEND_URL
- [ ] Redeployed frontend to GitHub Pages
- [ ] Tested chatbot on live site

## Final Verification
- [ ] Book loads: https://zohaibfaiz0.github.io/physical-ai-book/
- [ ] Backend: https://[app].up.railway.app/health
- [ ] Chatbot appears and responds
- [ ] Selected text mode works
- [ ] No console errors

## Common Issues Fixed
- [ ] Root directory set to `backend` (not repo root)
- [ ] Frontend files excluded via .dockerignore
- [ ] Requirements.txt optimized (removed langchain)
- [ ] Non-root user in Dockerfile
- [ ] CORS allows Railway domain