# Hacker Network - Quick Start Guide

Get the Hacker Network platform up and running in 5 minutes!

## 🚀 Quick Setup (5 minutes)

### 1. Clone & Install (1 min)
```bash
git clone <your-repo-url>
cd hacker-network-vercel
pnpm install
```

### 2. Create Supabase Database (2 min)
1. Go to https://supabase.com → Create new project
2. Wait for project to initialize
3. Go to SQL Editor → New Query
4. Copy & paste contents of `DATABASE_SCHEMA.sql`
5. Run the query
6. Get your `Project URL` and `anon key` from Settings → API

### 3. Set Environment Variables (1 min)
Create `.env.local`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-super-secret-key-min-32-chars
ADMIN_PASSWORD_HASH=$2b$10$abcdefghijklmnopqrstuvwxyz
ADMIN_PANEL_PATH=/secret-admin-xyz
APP_URL=http://localhost:3000
```

Generate admin password hash:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
```

### 4. Run Locally (1 min)
```bash
vercel dev
# Open http://localhost:3000
```

## ✅ Test the Platform

1. **Register**: Click "Get Started" → Create account
2. **Create Post**: Click "Create Post" → Fill form → Publish
3. **View Feed**: See your post in the feed
4. **Comment**: Click post → Add comment
5. **Like**: Click heart icon to like
6. **Profile**: View your profile and credits
7. **Admin**: Go to `http://localhost:3000/secret-admin-xyz` → Login as admin

## 📦 Deploy to Vercel (5 min)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to https://vercel.com/dashboard
# 3. Click "Add New" → "Project"
# 4. Import your GitHub repo
# 5. Add environment variables
# 6. Click "Deploy"
```

## 🎯 Key Features

| Feature | How to Use |
|---------|-----------|
| **Create Post** | Click "Create Post" button in feed |
| **Filter Posts** | Use filter buttons (News, Blog, Images) |
| **Topic Filter** | Click topic tags to filter |
| **Comments** | Click post → Add comment at bottom |
| **Like Posts** | Click ❤️ icon on any post |
| **View Profile** | Click "Profile" in navigation |
| **Admin Panel** | Visit `/secret-admin-xyz` (admin only) |

## 💳 Credit System

- **Start**: 300 credits per user
- **Cost**: 10 credits per post
- **Admin**: Can top-up or deduct credits

## 🔐 Admin Access

**URL**: `http://localhost:3000/secret-admin-xyz`
**Password**: Whatever you set in `ADMIN_PASSWORD_HASH`

**Admin Features**:
- View all users and their credits
- Update user credits
- Delete users
- View and delete posts
- System statistics

## 📁 Project Files

```
public/                    # Frontend (HTML/CSS/JS)
├── index.html            # Homepage
├── login.html            # Login/Register
├── feed.html             # Posts feed
├── create-post.html      # Create post
├── post.html             # Post detail
├── profile.html          # User profile
├── admin-panel.html      # Admin panel
├── css/style.css         # Dark theme styles
└── js/utils.js           # API client

api/                       # Backend (Serverless)
├── auth/                 # Authentication
├── posts/                # Posts CRUD
├── admin/                # Admin functions
└── storage/              # Image upload
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Check email/password, verify database is running |
| Posts not showing | Check SUPABASE_KEY is correct |
| Admin panel 404 | Check ADMIN_PANEL_PATH is correct |
| Credits not deducting | Verify database connection |
| Images not uploading | Set up Cloudinary or use placeholder |

## 📚 Full Documentation

- `README.md` - Complete project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - Architecture and features
- `DATABASE_SCHEMA.sql` - Database structure

## 🎨 Customize

### Change Colors
Edit `public/css/style.css` - update CSS variables

### Change Admin Path
Edit `.env.local` - change `ADMIN_PANEL_PATH`

### Change Credit Cost
Edit `api/posts/create.js` - change `CREDIT_COST`

### Change Initial Credits
Edit `api/_db.js` - change default credits value

## 🚀 Next Steps

1. ✅ Complete quick setup
2. ✅ Test all features locally
3. ✅ Deploy to Vercel
4. ✅ Share with community!

---

**Happy hacking! 🚀**

For more help, see `SETUP_GUIDE.md` or check the full `README.md`
