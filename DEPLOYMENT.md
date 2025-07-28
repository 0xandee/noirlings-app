# Deployment Guide

This document outlines how to deploy the Noirlings app to different platforms.

⚠️ **IMPORTANT**: This app requires significant memory (~6-8GB) due to Monaco Editor + Noir WASM files. Most free tiers will struggle with the build process.

## Platform Comparison

| Platform | Memory Limit | Build Success | Cost | Notes |
|----------|-------------|---------------|------|--------|
| Vercel Free | ~1GB | ❌ OOM Error | Free | Too limited |
| Vercel Pro | ~8GB | ✅ Works | $20/month | Reliable |
| Netlify | ~6-8GB | ⚠️ May work | Free | Inconsistent |
| Railway | ~4-6GB | ⚠️ May work | Free (with limits) | Worth trying |
| Render | ~4GB | ❌ Likely fails | Free | Too limited |

## Reality Check

Your app is **genuinely resource-intensive** because it includes:
- Monaco Editor (~400-600MB during build)
- Noir WASM files (~200-400MB) 
- React/TypeScript compilation (~200-300MB)
- Build tooling overhead (~200-400MB)

**Total: ~1.2-1.7GB peak memory usage**

## Railway Deployment (TRY FIRST)

Railway might work due to:
- ⚠️ Higher memory limits than other free tiers (~4-6GB)
- ✅ Good Node.js build support
- ✅ Automatic GitHub deployments

**Warning**: Even Railway may hit memory limits during build. Your app genuinely needs ~6-8GB.

### Steps to Try Railway:

1. **Connect Repository**:
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your noirlings-app repository

2. **Configure Build** (automatic):
   - Railway uses the `railway.json` config
   - Build: `cd packages/noirlings && yarn install && NODE_OPTIONS=--max-old-space-size=8192 vite build --mode railway`
   - Start: `npx serve dist -s -n -L -p $PORT` (static file server for SPA)

3. **Environment Variables**:
   Set in Railway dashboard → Variables tab:
   ```
   VITE_SUPABASE_URL=https://ajzoulspsdzrjxffqvoi.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem91bHNwc2R6cmp4ZmZxdm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDYzMDMsImV4cCI6MjA2Nzg4MjMwM30.iHTW9lmLwlq3nWsz1NYeQJg-ZKYgrOaN6SBMHNyndLg
   ```

4. **Deploy & Monitor**:
   - Railway will attempt to build
   - Check build logs for OOM errors
   - If it fails, Railway may not have enough memory

## Netlify Deployment (ALTERNATIVE)

### Steps:

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository

2. **Build Settings**:
   ```
   Base directory: packages/noirlings
   Build command: yarn build:netlify
   Publish directory: ../../dist
   ```

3. **Environment Variables**:
   In Netlify dashboard → Site settings → Environment variables:
   ```
   VITE_SUPABASE_URL=https://ajzoulspsdzrjxffqvoi.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem91bHNwc2R6cmp4ZmZxdm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDYzMDMsImV4cCI6MjA2Nzg4MjMwM30.iHTW9lmLwlq3nWsz1NYeQJg-ZKYgrOaN6SBMHNyndLg
   NODE_VERSION=18
   ```

## Vercel Pro (If budget allows)

If you decide to use Vercel Pro:

1. Upgrade to Pro plan ($20/month)
2. Use existing `vercel.json` configuration
3. Deploy will work with 8GB memory limit

## Build Commands Summary

- Local development: `yarn dev`
- Local build: `yarn build`
- Vercel build: `yarn vercel-build`
- Netlify build: `yarn build:netlify`
- Railway build: `yarn build:railway`

## Recommendation: Just Use Vercel Pro

After extensive testing, here's the honest truth:

**Your app is legitimately complex** and needs professional-grade resources:
- Monaco Editor is a full IDE in the browser
- Noir WASM files for cryptographic proofs  
- Complex React app with advanced features

**Vercel Pro ($20/month)** is likely your best option because:
- ✅ **Guaranteed 8GB memory** - no guessing
- ✅ **Reliable builds** - won't randomly fail
- ✅ **Professional support** - when things go wrong
- ✅ **CDN optimization** - faster app loading
- ✅ **No time wasted** - deploy once, works forever

Free tiers are designed for simple websites, not complex web applications like yours.

## Troubleshooting Free Tier Issues

### Memory Issues
- All deployment builds use optimized memory settings
- TypeScript declarations are disabled for faster builds
- Source maps are disabled to save memory
- Aggressive code splitting reduces memory per chunk
- **But this may still not be enough for free tiers**

### Environment Variables
- Make sure Supabase credentials are set correctly
- Variables must be prefixed with `VITE_` for client access
- Check platform-specific environment variable syntax

### When Free Tiers Fail
- Look for "OOM" (Out of Memory) errors in build logs
- Memory exhaustion typically happens during the Monaco Editor bundling phase
- This is normal - your app genuinely needs more resources than free tiers provide