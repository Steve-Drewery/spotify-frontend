# Production Environment Variables Setup

## Quick Setup for Your Current Deployment

### Netlify (Frontend) - spotify-vm.netlify.app

Go to: Site Settings → Environment Variables

Add these variables:
```
NEXT_PUBLIC_BACKEND_URL=https://spotify-frontend-aaq4.onrender.com
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyDpyLwkMH1IsrFXBA_mYdZCS4cge1V8DmA
```

### Render (Backend) - spotify-frontend-aaq4.onrender.com

Go to: Your Service → Environment

Add/Update these variables:
```
NODE_ENV=production
SPOTIFY_CLIENT_ID=d2756b0719ed438fa8c800b20730b123
SPOTIFY_CLIENT_SECRET=ec323e9f5d6a4eccbc2b13026bb14106
SPOTIFY_REDIRECT_URI=https://spotify-frontend-aaq4.onrender.com/callback
FRONTEND_URL=https://spotify-vm.netlify.app
ALLOWED_ORIGINS=https://spotify-vm.netlify.app
```

### Spotify Developer Dashboard

Go to: https://developer.spotify.com/dashboard → Your App → Edit Settings

**Redirect URIs** - Make sure these are added:
```
https://spotify-frontend-aaq4.onrender.com/callback
http://localhost:8888/callback (for local development)
```

## After Updating Environment Variables

1. **Render**: The service will automatically redeploy when you save environment variables
2. **Netlify**: Go to Deploys → Trigger deploy → Clear cache and deploy site
3. **Spotify**: Changes take effect immediately

## Troubleshooting

### State Mismatch Error
- Make sure cookies are working (check browser console for cookie errors)
- Verify CORS is allowing your Netlify domain
- Check that `ALLOWED_ORIGINS` includes your exact Netlify URL with `https://`

### Redirect URI Mismatch
- The redirect URI in Spotify Dashboard must **exactly** match `SPOTIFY_REDIRECT_URI` in Render
- Must include `https://` and the full path `/callback`

### CORS Errors
- Verify `ALLOWED_ORIGINS` in Render includes your Netlify URL
- Check that `FRONTEND_URL` matches your Netlify URL exactly

