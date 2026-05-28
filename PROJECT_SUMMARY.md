# Hacker Network - Project Summary

## 🎯 Project Overview

**Hacker Network** is a dark hacker-themed platform for sharing news, blogs, and images about cybersecurity, exploits, tools, CTF challenges, and privacy. Built as a static HTML/CSS/JavaScript frontend with Vercel serverless backend functions.

## ✨ Features Implemented

### 1. **Dark Hacker Theme**
- Neon green (#00ff41) and cyan (#00d9ff) color scheme
- Terminal-style monospace fonts (Courier New)
- Glitch effects and animations
- CSS grid and responsive design
- Mobile-optimized (breakpoints at 768px, 480px)

### 2. **User Authentication**
- Registration with email, password, username
- Login with JWT tokens
- Password hashing with bcrypt
- Session management with localStorage
- Automatic token refresh on page load

### 3. **Post Management**
- Create posts: News, Blog, Image types
- Topic tags: Cybersecurity, Exploit, Tools, CTF, Privacy
- Rich text content support
- Image upload and display
- Post filtering by type and topic
- View post details with comments

### 4. **Community Features**
- Comments on posts
- Like/upvote posts
- View comment authors and timestamps
- Delete own comments (or admin delete any)

### 5. **Credit System**
- Users start with 300 credits
- Costs 10 credits to create a post
- Admin can top-up or deduct credits
- Credit balance validation before posting
- Credit display in navigation and profile

### 6. **User Profiles**
- Display user info and statistics
- Show all user's posts
- Display total likes received
- Credit balance display
- Quick access to create new post

### 7. **Admin Panel**
- **Hidden URL**: Access only via secret path (e.g., `/secret-admin-xyz`)
- **Password Protected**: Requires admin login
- **Dashboard**: System statistics (users, posts, comments, likes)
- **User Management**: List all users, update credits, delete users
- **Post Management**: List all posts, delete posts
- **Restricted Access**: Only admin users can access

### 8. **Responsive Design**
- Mobile-first approach
- Touch-friendly buttons and forms
- Optimized layouts for all screen sizes
- Fast load times with static HTML/CSS/JS

## 📁 Project Structure

```
hacker-network-vercel/
├── public/                          # Static frontend files
│   ├── index.html                   # Homepage
│   ├── login.html                   # Login/Register
│   ├── feed.html                    # Posts feed
│   ├── create-post.html             # Create post form
│   ├── post.html                    # Post detail & comments
│   ├── profile.html                 # User profile
│   ├── admin-panel.html             # Hidden admin panel
│   ├── css/
│   │   └── style.css                # Global dark theme styles
│   └── js/
│       └── utils.js                 # API client & utilities
│
├── api/                             # Serverless functions
│   ├── _db.js                       # Database helper module
│   ├── _auth.js                     # Authentication helpers
│   ├── auth/
│   │   ├── login.js                 # POST /api/auth/login
│   │   ├── register.js              # POST /api/auth/register
│   │   └── me.js                    # GET /api/auth/me
│   ├── posts/
│   │   ├── list.js                  # GET /api/posts/list
│   │   ├── create.js                # POST /api/posts/create
│   │   ├── [id].js                  # GET/DELETE /api/posts/[id]
│   │   └── [id]/
│   │       ├── like.js              # POST /api/posts/[id]/like
│   │       └── comments.js          # GET/POST /api/posts/[id]/comments
│   ├── admin/
│   │   ├── users.js                 # GET/DELETE /api/admin/users
│   │   └── users/[id]/
│   │       └── credits.js           # PUT /api/admin/users/[id]/credits
│   ├── admin/
│   │   └── posts.js                 # GET/DELETE /api/admin/posts
│   └── storage/
│       └── upload.js                # POST /api/storage/upload
│
├── package.json                     # Dependencies
├── vercel.json                      # Vercel configuration
├── DATABASE_SCHEMA.sql              # PostgreSQL schema
├── SETUP_GUIDE.md                   # Deployment guide
├── README.md                        # Project documentation
└── todo.md                          # Task tracking

```

## 🔧 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js Serverless Functions (Vercel) |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | JWT + bcrypt |
| **Image Storage** | Cloudinary (configurable) |
| **Hosting** | Vercel |

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user info

### Posts
- `GET /api/posts/list` - List posts (with filters)
- `POST /api/posts/create` - Create new post
- `GET /api/posts/[id]` - Get post details
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/like` - Like a post
- `GET /api/posts/[id]/comments` - Get comments
- `POST /api/posts/[id]/comments` - Add comment

### Admin (requires admin role)
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/[id]` - Delete user
- `PUT /api/admin/users/[id]/credits` - Update user credits
- `GET /api/admin/posts` - List all posts
- `DELETE /api/admin/posts/[id]` - Delete post

### Storage
- `POST /api/storage/upload` - Upload image

## 🔐 Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Minimum 8 characters required
   - Never stored in plain text

2. **JWT Authentication**
   - Secure token-based auth
   - 7-day expiration
   - Automatic logout on invalid token

3. **Admin Panel**
   - Hidden URL path (configurable)
   - Password protection
   - Admin role verification
   - Restricted access to management functions

4. **Input Validation**
   - Server-side validation on all endpoints
   - Email format validation
   - Username length validation
   - Content sanitization

5. **Database Security**
   - PostgreSQL with SSL
   - Automatic backups (Supabase)
   - Row Level Security (RLS) policies
   - Foreign key constraints

## 💳 Credit System Details

| Action | Cost | Notes |
|--------|------|-------|
| Create Post | 10 credits | Deducted on successful post creation |
| Register | 0 | Users start with 300 credits |
| Comment | 0 | Free to engage |
| Like | 0 | Free to engage |

**Admin Controls:**
- View all user credits
- Add credits (top-up)
- Deduct credits (penalty)
- No minimum credit requirement to comment/like

## 🎨 Design System

### Color Palette
```css
--primary-neon: #00ff41;      /* Neon Green */
--secondary-cyan: #00d9ff;    /* Cyan */
--dark-bg: #0a0e27;           /* Dark Background */
--darker-bg: #050812;         /* Darker Background */
--card-bg: #1a1f3a;           /* Card Background */
--border-color: #2a3f5f;      /* Border Color */
--text-primary: #e0e0e0;      /* Primary Text */
--text-secondary: #a0a0a0;    /* Secondary Text */
--accent-red: #ff0055;        /* Red Accent */
--accent-purple: #9d00ff;     /* Purple Accent */
```

### Typography
- **Headings**: Courier New (monospace), 700 weight
- **Body**: System fonts (sans-serif)
- **Code**: Courier New (monospace)
- **Letter Spacing**: 0.05em for uppercase text

### Components
- Buttons with hover animations
- Cards with glitch effects on hover
- Forms with focus states
- Tags and badges
- Responsive grid layouts

## 🚀 Deployment

### Local Development
```bash
pnpm install
vercel dev
# Open http://localhost:3000
```

### Production Deployment
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel Dashboard
# Set environment variables
# Deploy automatically on push
```

### Environment Variables Required
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-secret-key-min-32-chars
ADMIN_PASSWORD_HASH=$2b$10$...
ADMIN_PANEL_PATH=/secret-admin-xyz
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
APP_URL=https://your-domain.vercel.app
```

## 📈 Performance

- **Frontend**: Static HTML/CSS/JS - instant load
- **Backend**: Serverless functions - auto-scaling
- **Database**: PostgreSQL with indexes - fast queries
- **Images**: CDN delivery via Cloudinary
- **Caching**: Browser caching enabled

## 🔄 Data Flow

```
User Browser
    ↓
Static HTML/CSS/JS (public/)
    ↓
API Calls (fetch)
    ↓
Vercel Serverless Functions (api/)
    ↓
PostgreSQL Database (Supabase)
    ↓
Response JSON
    ↓
Frontend renders
```

## 🛠️ Customization Guide

### Change Admin Panel URL
Edit `.env.local`:
```env
ADMIN_PANEL_PATH=/your-secret-path
```

### Change Credit Cost
Edit `api/posts/create.js`:
```javascript
const CREDIT_COST = 10; // Change this
```

### Change Initial Credits
Edit `api/_db.js`:
```javascript
credits: 300, // Change this
```

### Change Color Scheme
Edit `public/css/style.css`:
```css
:root {
  --primary-neon: #00ff41;  /* Change colors */
  --secondary-cyan: #00d9ff;
  /* ... */
}
```

## 📝 Next Steps

1. **Set up Supabase database** - Follow SETUP_GUIDE.md
2. **Configure environment variables** - Add to `.env.local`
3. **Test locally** - Run `vercel dev`
4. **Deploy to Vercel** - Push to GitHub and deploy
5. **Monitor and maintain** - Check logs and stats

## 📚 Documentation

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Complete setup instructions
- `DATABASE_SCHEMA.sql` - Database schema
- `api/` - API endpoint documentation in each file

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test locally
4. Submit pull request

## 📧 Support

For issues and questions:
1. Check SETUP_GUIDE.md troubleshooting section
2. Review API endpoint documentation
3. Check browser console for errors
4. Review Vercel logs: `vercel logs`

---

**Built with ⚡ for the hacker community**

*Last Updated: May 28, 2026*
