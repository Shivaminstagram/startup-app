# Deployment Guide

Deploy your Startup Network app to the internet in minutes!

## Quick Deployment (Recommended: Netlify)

### Option 1: Netlify (Easiest)

#### Step 1: Push to GitHub
1. Initialize git: `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial commit"`
4. Create GitHub repo at https://github.com/new
5. Push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/startup-network.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Netlify
1. Go to https://app.netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Select your repository
5. Build settings (leave default):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy site**

#### Step 3: Add Environment Variables
1. In Netlify dashboard, go to your site
2. Click **Site settings**
3. Go to **Build & deploy** → **Environment**
4. Click **Edit variables**
5. Add:
   - Key: `VITE_SUPABASE_URL`
   - Value: Your Supabase URL
6. Add:
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase Anon Key
7. Click **Save**
8. Trigger a redeploy:
   - Go to **Deploys**
   - Click **Trigger deploy**

#### Step 4: Custom Domain (Optional)
1. In site settings, go to **Domain management**
2. Click **Add custom domain**
3. Follow the DNS setup instructions

**Done!** Your app is live! ✨

---

### Option 2: Vercel

#### Step 1: Push to GitHub
(Same as Netlify Step 1 above)

#### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **New Project**
4. Select your repository
5. Click **Import**

#### Step 3: Add Environment Variables
1. Go to project settings
2. Click **Environment Variables**
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**

**Done!** Your app is live! ✨

---

### Option 3: Docker + Heroku

#### Prerequisites
- Docker installed: https://www.docker.com/products/docker-desktop
- Heroku account: https://www.heroku.com

#### Step 1: Create Dockerfile
Already exists in the project root. Check it has:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### Step 2: Create heroku.yml
Create `heroku.yml` in project root:
```yaml
build:
  docker:
    web: Dockerfile
```

#### Step 3: Deploy to Heroku
```bash
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set VITE_SUPABASE_URL=your-url
heroku config:set VITE_SUPABASE_ANON_KEY=your-key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

Your app is at: `https://your-app-name.herokuapp.com`

---

### Option 4: AWS S3 + CloudFront

#### Step 1: Create S3 Bucket
1. Go to https://s3.console.aws.amazon.com
2. Create new bucket (name: your-app-name)
3. Unblock public access (⚠️ only for this bucket)

#### Step 2: Build & Upload
```bash
# Build optimized version
npm run build

# Upload to S3 (install AWS CLI first)
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Step 3: Enable Static Site Hosting
1. Go to bucket settings
2. Enable "Static website hosting"
3. Set Index document to `index.html`
4. Set Error document to `index.html` (for routing)

#### Step 4: CloudFront (Optional)
1. Create CloudFront distribution
2. Set origin to your S3 bucket
3. Use CloudFront URL instead of S3

---

## Pre-Deployment Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Build locally: `npm run build` runs without errors
- [ ] `dist/` folder is created and contains files
- [ ] GitHub repo is private initially
- [ ] Supabase project is created and configured
- [ ] Database tables exist and RLS policies are set
- [ ] Environment variables are ready to add to deployment platform

## Post-Deployment Testing

1. **Test sign up** with real email
2. **Test role selection** and profile creation
3. **Test feed** - see it populate with users
4. **Test chat** - send and receive messages
5. **Test real-time** - online status updates
6. **Test on mobile** - use DevTools (F12 → Toggle device toolbar)

## Monitoring & Logs

### Netlify
- Site → **Analytics**
- Site → **Functions** → View logs

### Vercel
- Project → **Analytics**
- Project → **Logs** → View real-time logs

### Heroku
```bash
heroku logs --tail
```

### Docker
```bash
docker logs <container-id>
```

## Custom Domain Setup

### Netlify
1. Go to domain management
2. Add custom domain
3. Update DNS records properly

### Vercel
1. Add domain in project settings
2. Update DNS records properly

### Route 53 (AWS)
If you bought domain on Route 53:
1. Create hosted zone
2. Add records pointing to your deployment

## Environment Variables Reference

Required for production:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

These are already in `.env.example` - never commit `.env.local`!

## Security Best Practices

✓ Use HTTPS everywhere (automatic with Netlify/Vercel)
✓ Never commit `.env.local`
✓ Keep your Anon Key secret (but it's safe client-side due to RLS)
✓ Enable GitHub branch protection
✓ Use environment secrets, not hardcoded values
✓ Keep dependencies updated: `npm audit`

## Performance Tips

- Netlify/Vercel provide free CDN (very fast)
- Supabase automatically optimizes database
- Build time: ~30-60 seconds
- Deployments are automatic on git push

## Cost Estimates

### Netlify (Free)
- Hosting: Free
- Bandwidth: 100GB/month free

### Vercel (Free)
- Hosting: Free
- Bandwidth: Generous free tier

### Supabase (Free)
- Database: 500MB free
- Auth: Unlimited free
- Realtime: Free

### Total for MVP: **$0/month** ✨

## Scaling for Production

When you need to scale:

1. **Database** → Upgrade Supabase plan
2. **Hosting** → Upgrade Netlify/Vercel plan
3. **Traffic** → Add CDN caching
4. **Users** → Optimize queries with indexes

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| "Build failed" | Check `npm run build` works locally |
| "Env vars not loading" | Restart deployment after setting variables |
| "App won't load" | Check browser console (F12) for errors |
| "Messages not syncing" | Check Supabase Realtime is enabled |
| "Auth broken" | Verify auth URL is correct for your domain |

## Get Help

- Netlify docs: https://docs.netlify.com
- Vercel docs: https://vercel.com/docs
- Heroku docs: https://devcenter.heroku.com
- AWS docs: https://docs.aws.amazon.com

---

**Your app is ready to show the world!** 🚀

Choose your deployment platform and follow the steps above.
