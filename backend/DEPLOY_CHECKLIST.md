# Koyeb Deployment Checklist

## Pre-Deployment
- [ ] Signed up for Koyeb account
- [ ] Connected GitHub to Koyeb
- [ ] Have all environment variable values ready
- [ ] Backend runs locally without errors
- [ ] Dockerfile builds successfully locally

## During Deployment
- [ ] Created web service in Koyeb
- [ ] Selected correct repository and branch
- [ ] Set Dockerfile path to `backend/Dockerfile`
- [ ] Set build context to `backend`
- [ ] Added all 5 environment variables
- [ ] Set port to 8000
- [ ] Configured health check to `/health`
- [ ] Selected Singapore region (or closest)

## Post-Deployment
- [ ] Service shows "Healthy" status
- [ ] Health endpoint returns 200 OK
- [ ] Can query /chat endpoint successfully
- [ ] Updated frontend BACKEND_URL
- [ ] Redeployed frontend to GitHub Pages
- [ ] Tested chatbot works on live site
- [ ] Verified CORS working
- [ ] Checked logs for errors

## Final Verification
- [ ] Book loads: https://zohaibfaiz0.github.io/physical-ai-book/
- [ ] Backend responds: https://your-app.koyeb.app/health
- [ ] Chatbot button appears
- [ ] Can send messages and get responses
- [ ] Selected text mode works
- [ ] Citations appear correctly

## If Issues
- [ ] Check Koyeb logs
- [ ] Verify environment variables
- [ ] Test backend directly (curl)
- [ ] Check browser console for CORS errors
- [ ] Verify frontend has correct backend URL