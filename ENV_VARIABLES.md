# Environment Variables Reference

## Backend (Server) - Render

Set these in Render dashboard under Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `SPOTIFY_CLIENT_ID` | Spotify App Client ID | `d2756b0719ed438fa8c800b20730b123` |
| `SPOTIFY_CLIENT_SECRET` | Spotify App Client Secret | `ec323e9f5d6a4eccbc2b13026bb14106` |
| `SPOTIFY_REDIRECT_URI` | Spotify callback URL | `https://your-app.onrender.com/callback` |
| `FRONTEND_URL` | Your Netlify frontend URL | `https://your-app.netlify.app` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `https://your-app.netlify.app` |
| `PORT` | Server port (auto-set by Render) | Leave empty |

## Frontend (App) - Netlify

Set these in Netlify dashboard under Site Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Your Render backend URL | `https://your-app.onrender.com` |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | YouTube Data API v3 key | `AIzaSy...` |

**Note**: In Next.js, environment variables accessible in the browser must be prefixed with `NEXT_PUBLIC_`.

## Local Development

Create these files for local development:

### `server/.env`
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
PORT=8888
NODE_ENV=development
```

### `app/.env.local`
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8888
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

**Important**: Never commit `.env` or `.env.local` files to Git!

