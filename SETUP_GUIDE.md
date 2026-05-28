# Hacker Network - Setup & Deployment Guide

Complete guide to set up and deploy the Hacker Network platform on Vercel.

## 📋 Prerequisites

- Node.js 16+ and npm/pnpm
- Vercel account (free tier works)
- Supabase account (free tier includes PostgreSQL)
- Cloudinary account (optional, for image uploads)
- Git and GitHub account

## 🚀 Step-by-Step Setup

### 1. Clone & Initialize Project

```bash
# Clone the repository
git clone <your-repo-url>
cd hacker-network-vercel

# Install dependencies
pnpm install
```

### 2. Set Up Database (Supabase)

1. **Create Supabase Project**:
   - Go to https://supabase.com
   - Click "New Project"
   - Choose a name, password, and region
   - Wait for project to be created

2. **Run Database Schema**:
   - In Supabase dashboard, go to SQL Editor
   - Click "New Query"
   - Copy contents of `DATABASE_SCHEMA.sql`
   - Paste and run the query
   - Verify tables are created

3. **Get Connection Details**:
   - Go to Project Settings → API
   - Copy `Project URL` (this is your SUPABASE_URL)
   - Copy `anon public` key (this is your SUPABASE_KEY)

### 3. Generate Admin Password Hash

```bash
# Generate bcrypt hash for admin password
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-secure-admin-password', 10).then(hash => console.log(hash));"
```

Save the output hash - you'll need it for environment variables.

### 4. Set Up Environment Variables

Create `.env.local` file in project root:

```env
# Database (from Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Admin Panel
ADMIN_PASSWORD_HASH=$2b$10$... # paste the hash from step 3
ADMIN_PANEL_PATH=/secret-admin-xyz # change to any secret path

# Image Storage (Cloudinary - optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
APP_URL=https://your-domain.vercel.app
```

### 5. Test Locally

```bash
# Install Vercel CLI
npm install -g vercel

# Run development server
vercel dev

# Open http://localhost:3000 in browser
```

Test the following flows:
- Register a new account
- Login with credentials
- Create a post (should deduct 10 credits)
- View feed and filter posts
- Add comments to posts
- Like posts
- Visit profile page
- Access admin panel at `http://localhost:3000/secret-admin-xyz`

### 6. Deploy to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit: Hacker Network platform"
git push origin main
```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add all variables from `.env.local`:
     - SUPABASE_URL
     - SUPABASE_KEY
     - JWT_SECRET
     - ADMIN_PASSWORD_HASH
     - ADMIN_PANEL_PATH
     - CLOUDINARY_* (if using)
     - APP_URL

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `https://your-project.vercel.app`

## 🔧 Configuration

### Change Admin Panel URL

Edit `.env.local`:
```env
ADMIN_PANEL_PATH=/your-secret-path-here
```

Then access admin panel at: `https://your-domain.vercel.app/your-secret-path-here`

### Change Credit Cost Per Post

Edit `api/posts/create.js`:
```javascript
const CREDIT_COST = 10; // Change this value
```

### Change Initial Credits Per User

Edit `api/_db.js` in `createUser` function:
```javascript
credits: 300, // Change this value
```

### Add Image Upload Support

1. Create Cloudinary account at https://cloudinary.com
2. Get API credentials from dashboard
3. Add to `.env.local`
4. Update `api/storage/upload.js` with actual upload logic

## 🔐 Security Considerations

### In Production:

1. **Change JWT Secret**: Use a strong, random 32+ character string
2. **Change Admin Password**: Use a strong password and hash it
3. **Change Admin Panel URL**: Use an unpredictable path
4. **Enable HTTPS**: Vercel provides free SSL
5. **Rate Limiting**: Add rate limiting to prevent abuse
6. **Input Validation**: All inputs are validated server-side
7. **CORS**: Configure CORS to only allow your domain

### Database Security:

- Supabase provides SSL by default
- Enable Row Level Security (RLS) policies
- Regular backups are automatic
- Never commit `.env.local` to git

## 📊 Monitoring & Maintenance

### Check Logs:

```bash
# View Vercel logs
vercel logs

# View specific function logs
vercel logs api/auth/login
```

### Database Backups:

- Supabase automatically backs up daily
- Manual backups available in Supabase dashboard

### Monitor Usage:

- Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com

## 🐛 Troubleshooting

### "Unauthorized" errors

**Problem**: Users can't login or API returns 401
**Solution**: 
- Check JWT_SECRET is same on all deployments
- Clear browser cookies and try again
- Verify token is in Authorization header

### Database connection errors

**Problem**: "Cannot connect to database"
**Solution**:
- Verify SUPABASE_URL and SUPABASE_KEY are correct
- Check Supabase project is running
- Verify IP whitelist in Supabase settings

### Image upload fails

**Problem**: Image upload returns 500 error
**Solution**:
- Verify Cloudinary credentials if using
- Check file size < 5MB
- Verify CORS settings

### Admin panel not accessible

**Problem**: 404 when accessing admin panel
**Solution**:
- Check ADMIN_PANEL_PATH is correct
- Verify you're logged in as admin user
- Clear browser cache

### Credits not deducting

**Problem**: Posts created but credits not deducted
**Solution**:
- Check SUPABASE_KEY has write permissions
- Verify credit_cost in `api/posts/create.js`
- Check user has sufficient credits before posting

## 📈 Scaling Tips

### Optimize Database:

- Add more indexes for frequently queried fields
- Archive old posts to separate table
- Use connection pooling

### Optimize Frontend:

- Enable caching headers
- Minify CSS/JS
- Use CDN for images

### Optimize Backend:

- Cache frequently accessed data
- Use database query optimization
- Monitor function execution time

## 🆘 Support & Help

### Resources:

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Node.js Docs: https://nodejs.org/docs

### Common Issues:

See troubleshooting section above or check GitHub issues.

## 📝 Next Steps

1. ✅ Complete setup
2. ✅ Test all features locally
3. ✅ Deploy to Vercel
4. ✅ Configure custom domain (optional)
5. ✅ Set up monitoring
6. ✅ Share with community!

---

**Happy hacking! 🚀**
