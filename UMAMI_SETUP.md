# Umami Analytics Setup Guide

This guide will help you set up Umami analytics for your Noirlings app. Umami is a privacy-focused, open-source analytics platform that you can self-host for free.

## Option 1: Deploy Umami on Railway (Recommended)

### Step 1: Deploy Umami Server

1. **Fork or use the Umami Railway Template**
   - Go to https://railway.app
   - Create a new project
   - Click "Deploy from GitHub repo"
   - Use the official Umami repo: `https://github.com/umami-software/umami`

2. **Alternative: One-Click Deploy**
   - Visit: https://railway.app/template/umami
   - Click "Deploy Now"
   - This will automatically set up Umami with a PostgreSQL database

### Step 2: Configure Database

Railway will automatically provision a PostgreSQL database. The Umami template handles this for you.

### Step 3: Get Your Credentials

After deployment:

1. Open your Umami dashboard (Railway will provide the URL)
2. Default login credentials:
   - Username: `admin`
   - Password: `umami`
   - **Important:** Change these immediately after first login!

3. Add a new website:
   - Go to Settings → Websites → Add Website
   - Name: `Noirlings`
   - Domain: `noirlings.app`
   - Click Save

4. Copy your Website ID and Umami URL

### Step 4: Configure Your Noirlings App

1. Update your `.env` file (in `packages/noirlings/`):

```env
VITE_UMAMI_URL=https://your-umami-app.railway.app
VITE_UMAMI_WEBSITE_ID=your-website-id-here
```

2. Deploy your app with the new environment variables

## Option 2: Use Umami Cloud (Paid)

If you prefer not to self-host:

1. Sign up at https://cloud.umami.is
2. Create a new website
3. Get your tracking code details
4. Add the credentials to your `.env` file

## Option 3: Deploy on Your Own Server

If you have your own server:

```bash
# Clone Umami
git clone https://github.com/umami-software/umami.git
cd umami

# Install dependencies
npm install

# Set up your database (PostgreSQL or MySQL)
# Create a .env file with your database URL
DATABASE_URL=postgresql://username:password@localhost:5432/umami

# Build and start
npm run build
npm start
```

## Verifying Analytics are Working

1. Visit your website
2. Open your Umami dashboard
3. You should see real-time visitors appear
4. Check the browser console for any Umami-related errors

## Using with Existing Supabase Database

If you want to use your existing Supabase PostgreSQL database for Umami:

1. In your Supabase project, create a new database for Umami
2. Get the connection string from Supabase
3. Set it as `DATABASE_URL` in your Umami Railway deployment
4. Umami will automatically create the necessary tables

## Troubleshooting

### Analytics not showing up?

- Check browser console for errors
- Verify environment variables are set correctly
- Make sure your Umami server is running
- Check that the Website ID matches your Umami dashboard

### Script blocked by ad blockers?

- Some ad blockers may block Umami's script
- Users with ad blockers won't be tracked (which is expected and respects privacy)

### CORS issues?

- Make sure your Umami server allows requests from your domain
- Check Umami's CORS settings if needed

## Cost Comparison

- **Self-hosted on Railway**: Free tier or ~$5/month for small traffic
- **Umami Cloud**: Starting at ~$9/month
- **Your own server**: Whatever your hosting costs

## Privacy Benefits

- No cookies required
- GDPR/CCPA compliant
- You own your data
- No third-party tracking
- Lightweight script (~2KB)

## Next Steps

Once set up, you can:
- Create custom events
- Set up goals
- Generate reports
- Share dashboards publicly (optional)
- Use the Umami API for custom integrations
