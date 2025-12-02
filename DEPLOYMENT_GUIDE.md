# Deployment Guide

## Overview
This guide covers deploying the Physical AI & Humanoid Robotics Textbook:
- **Frontend (Docusaurus)**: Deployed to GitHub Pages
- **Backend (FastAPI)**: Deployed to Vercel

## Frontend Deployment (GitHub Pages)

### Automatic Deployment
The frontend automatically deploys to GitHub Pages when you push to the `main` branch via GitHub Actions.

**GitHub Pages URL**: `https://abdul-kabir-jawed.github.io/agentic_ai_projects/`

### Manual Steps (if needed)
1. Go to your repository: `https://github.com/abdul-kabir-jawed/agentic_ai_projects`
2. Navigate to **Settings → Pages**
3. Ensure **Source** is set to **GitHub Actions**
4. The workflow (`.github/workflows/deploy-docusaurus.yml`) will automatically build and deploy

## Backend Deployment (Vercel)

### Project Information
- **Project Name**: `panaversity-robotics-hackathon`
- **Project ID**: `prj_EInRXfYlDDFBGRmw3I1cS4U1Odd3`
- **Team ID**: `team_10nD9U6XWfBGA4ADfautHK2W`
- **Deployment URL**: `https://panaversity-robotics-hackathon.vercel.app`

### Required Environment Variables

Set these in **Vercel Dashboard → Project Settings → Environment Variables**:

1. **DATABASE_URL**
   - Your Neon PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database?sslmode=require`

2. **JWT_SECRET_KEY**
   - A secure random string for JWT token signing
   - Generate with: `openssl rand -hex 32`

3. **GEMINI_API_KEY**
   - Your Google Gemini API key
   - Get from: https://makersuite.google.com/app/apikey

4. **QDRANT_URL**
   - Your Qdrant Cloud cluster URL
   - Format: `https://your-cluster.qdrant.io`

5. **QDRANT_API_KEY**
   - Your Qdrant Cloud API key

6. **ALLOWED_ORIGINS** (Optional)
   - Comma-separated list of allowed CORS origins
   - Default includes: `https://abdul-kabir-jawed.github.io,https://abdul-kabir-jawed.github.io/agentic_ai_projects`
   - Example: `http://localhost:3000,http://127.0.0.1:3000,https://abdul-kabir-jawed.github.io,https://abdul-kabir-jawed.github.io/agentic_ai_projects`

7. **OPENAI_API_KEY** (Optional)
   - Only needed if using OpenAI models (currently using Gemini)

### Deployment Steps

1. **Connect Repository to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click **Add New Project**
   - Import `abdul-kabir-jawed/agentic_ai_projects`
   - Select the `main` branch
   - Click **Create** (you'll configure root directory in the next step)
   
2. **Configure Root Directory** (after project is created):
   - In the project overview, go to **Settings** → **General**
   - Scroll down to **Root Directory**
   - Click **Edit** and set it to `backend`
   - Click **Save**

3. **Configure Build Settings** (optional, Vercel auto-detects Python):
   - Go to **Settings** → **General**
   - **Framework Preset**: Other (or leave as auto-detected)
   - **Build Command**: (leave empty, Vercel auto-detects Python)
   - **Output Directory**: (leave empty)
   - **Install Command**: `pip install -r requirements.txt` (optional, Vercel will use requirements.txt automatically)

4. **Set Environment Variables**:
   - Add all required environment variables listed above
   - Set them for **Production**, **Preview**, and **Development** environments

5. **Deploy**:
   - Click **Deploy**
   - Vercel will automatically deploy on every push to `main` branch

### Verifying Deployment

1. **Health Check**:
   ```bash
   curl https://panaversity-robotics-hackathon.vercel.app/health
   ```
   Should return: `{"status":"healthy","database":"connected",...}`

2. **Test API Endpoint**:
   ```bash
   curl https://panaversity-robotics-hackathon.vercel.app/
   ```
   Should return: `{"message":"Welcome to the Physical AI & Humanoid Robotics Textbook Backend!",...}`

## Connecting Frontend to Backend

The frontend automatically detects the correct API URL:
- **Local Development**: Uses `http://localhost:8000` when running on localhost
- **Production (GitHub Pages)**: Uses `https://panaversity-robotics-hackathon.vercel.app`

This is handled by the `getApiBaseUrl()` function in:
- `book/src/contexts/AuthContext.tsx`
- `book/src/hooks/useChatAPI.ts`
- `book/src/components/TranslationSwitcher.tsx`
- `book/src/components/PersonalizationControls.tsx`
- `book/src/components/TranslationSwitcherButton.tsx`

## Troubleshooting

### Backend Returns 500 Error
1. Check Vercel deployment logs: **Vercel Dashboard → Project → Deployments → [Latest] → Logs**
2. Verify all environment variables are set correctly
3. Check database connection (ensure `DATABASE_URL` is correct)
4. Verify Qdrant connection (ensure `QDRANT_URL` and `QDRANT_API_KEY` are set)

### CORS Errors
1. Ensure `ALLOWED_ORIGINS` includes your GitHub Pages URL
2. Check backend CORS middleware configuration in `backend/main.py`

### Frontend Can't Connect to Backend
1. Verify backend is deployed and healthy: `https://panaversity-robotics-hackathon.vercel.app/health`
2. Check browser console for CORS or network errors
3. Verify the frontend is using the correct API URL (check browser DevTools → Network tab)

### GitHub Pages Not Updating
1. Check GitHub Actions workflow: **Repository → Actions**
2. Ensure workflow completed successfully
3. Verify GitHub Pages is enabled: **Repository → Settings → Pages**

## Notes

- The `openai-agents` package is required but may need to be installed from a GitHub repository or local path if not available on PyPI
- If `openai-agents` is not available, you may need to:
  1. Install it from GitHub: `pip install git+https://github.com/openai/agents-python.git`
  2. Or bundle it with your deployment

