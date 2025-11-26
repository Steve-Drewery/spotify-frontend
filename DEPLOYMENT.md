# Deployment Guide

This guide will help you deploy the Spotify Music Video Player to production.

## Architecture

- **Frontend (Next.js)**: Deployed to Netlify
- **Backend (Express)**: Deployed to Render

## Prerequisites

1. GitHub repository with your code
2. Netlify account (free tier available)
3. Render account (free tier available)
4. Spotify Developer account with app credentials
5. YouTube Data API key

## Step 1: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `spotify-auth-server` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `SPOTIFY_CLIENT_ID` = Your Spotify Client ID
   - `SPOTIFY_CLIENT_SECRET` = Your Spotify Client Secret
   - `SPOTIFY_REDIRECT_URI` = `https://your-render-app.onrender.com/callback`
   - `FRONTEND_URL` = `https://your-netlify-app.netlify.app` (you'll get this after Step 2)
   - `ALLOWED_ORIGINS` = `https://your-netlify-app.netlify.app`
   - `PORT` = Leave empty (Render sets this automatically)
6. Click "Create Web Service"
7. **Copy your Render service URL** (e.g., `https://spotify-auth-server.onrender.com`)

## Step 2: Update Spotify App Settings

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Click "Edit Settings"
4. Under "Redirect URIs", add:
   - `https://your-render-app.onrender.com/callback`
5. Click "Save"

## Step 3: Deploy Frontend to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory**: `app`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `.next`
5. Add Environment Variables (Site settings → Environment variables):
   - `NEXT_PUBLIC_BACKEND_URL` = `https://your-render-app.onrender.com`
   - `NEXT_PUBLIC_YOUTUBE_API_KEY` = Your YouTube API key
6. Click "Deploy site"
7. **Copy your Netlify site URL** (e.g., `https://your-app.netlify.app`)

## Step 4: Update Backend Environment Variables

1. Go back to Render dashboard
2. Update the environment variables:
   - `FRONTEND_URL` = Your Netlify URL (from Step 3)
   - `ALLOWED_ORIGINS` = Your Netlify URL
3. The service will automatically redeploy

## Step 5: Update Spotify Redirect URI (if needed)

If you used a placeholder URL in Step 2, update it with your actual Render URL.

## Step 6: Test Your Deployment

1. Visit your Netlify URL
2. Click "Login" - it should redirect to Spotify
3. After authorization, you should be redirected back to your app
4. Test "Get Song" and "Get Video" functionality

## Troubleshooting

### CORS Errors
- Make sure `ALLOWED_ORIGINS` in Render includes your exact Netlify URL (with `https://`)
- Check that `FRONTEND_URL` matches your Netlify URL

### Invalid Redirect URI
- Ensure the redirect URI in Spotify Dashboard exactly matches `SPOTIFY_REDIRECT_URI` in Render
- Must include `https://` and the full path `/callback`

### Environment Variables Not Working
- In Netlify, make sure variables start with `NEXT_PUBLIC_` for client-side access
- Restart the Netlify build after adding environment variables
- In Render, make sure to save environment variables and wait for redeploy

### Backend Not Responding
- Check Render logs for errors
- Verify all environment variables are set correctly
- Make sure the service is running (not sleeping on free tier)

## Local Development

For local development, create `.env` files:

**server/.env:**
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
PORT=8888
NODE_ENV=development
```

**app/.env.local:**
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8888
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

## Notes

- Render free tier services sleep after 15 minutes of inactivity
- Netlify free tier has build time limits
- Make sure to use HTTPS URLs in production (both services provide this)
- Keep your API keys secure - never commit them to Git

