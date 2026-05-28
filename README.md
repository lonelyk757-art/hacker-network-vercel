# Hacker Network - Vercel Static Site with Serverless Backend

A dark hacker-themed platform for sharing news, blogs, and images about cybersecurity, exploits, tools, CTF challenges, and privacy. Built with plain HTML/CSS/JavaScript frontend and Vercel serverless functions backend.

## 🚀 Features

- **Dark Hacker Theme**: Neon green/cyan accents, terminal fonts, and glitch effects
- **User Authentication**: JWT-based login/register with secure password hashing
- **Post Management**: Create news, blog, and image posts with topic tags
- **Credit System**: Users start with 300 credits, spend credits to post content
- **Community Features**: Comments, likes/upvotes on posts
- **User Profiles**: View published posts and credit balance
- **Admin Panel**: Hidden URL with password protection for managing users, posts, and credits
- **Image Upload**: Cloud storage integration for post images
- **Responsive Design**: Mobile-friendly interface

## 📋 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js Serverless Functions (Vercel)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT with bcrypt password hashing
- **Image Storage**: Cloudinary or similar cloud storage service
- **Hosting**: Vercel

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 16+ and npm/pnpm
- Vercel account
- Supabase account (PostgreSQL database)
- Cloudinary account (image storage)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd hacker-network-vercel
pnpm install
```

### 2. Database Setup (Supabase)

1. Create a new Supabase project
2. Run the following SQL to create tables:

```sql
-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  credits INTEGER DEFAULT 300,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'news', 'blog', 'image'
  tags TEXT, -- comma-separated
  image_url TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_users_email ON users(email);
```

### 3. Environment Variables

Create a `.env.local` file with:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Admin Panel
ADMIN_PASSWORD_HASH=$2b$10$... # bcrypt hash of admin password
ADMIN_PANEL_PATH=/secret-admin-xyz # hidden URL path

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
APP_URL=https://your-domain.vercel.app
```

### 4. Generate Admin Password Hash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-admin-password', 10).then(hash => console.log(hash));"
```

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Deploy again after setting env vars
vercel --prod
```

## 📁 Project Structure

```
public/
  ├── index.html              # Homepage
  ├── login.html              # Login/Register page
  ├── feed.html               # Posts feed
  ├── create-post.html        # Create post page
  ├── post.html               # Single post detail
  ├── profile.html            # User profile
  ├── admin-panel.html        # Hidden admin panel
  ├── css/
  │   └── style.css           # Global styles (dark theme)
  └── js/
      └── utils.js            # Utility functions & API client

api/
  ├── _db.js                  # Database helper module
  ├── _auth.js                # Authentication helper
  ├── auth/
  │   ├── login.js            # Login endpoint
  │   ├── register.js         # Register endpoint
  │   └── me.js               # Get current user
  ├── posts/
  │   ├── create.js           # Create post
  │   ├── list.js             # List posts
  │   ├── [id].js             # Get post detail
  │   └── [id]/
  │       ├── comments.js     # Comments endpoints
  │       └── like.js         # Like endpoint
  ├── admin/
  │   ├── users.js            # Manage users
  │   └── posts.js            # Manage posts
  └── storage/
      └── upload.js           # Image upload

vercel.json                    # Vercel configuration
package.json                   # Dependencies
.env.example                   # Environment template
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth with expiration
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Admin Panel**: Hidden URL path + password protection
- **CORS**: Configured for frontend domain only
- **Input Validation**: All inputs validated server-side
- **Rate Limiting**: Recommended to add rate limiting in production

## 💳 Credit System

- **Initial Credits**: 300 per user
- **Cost per Post**: Configurable (default: 10 credits)
- **Admin Controls**: Top-up or deduct credits for users
- **Validation**: Posts rejected if insufficient credits

## 🖼️ Image Upload

Images are stored in Cloudinary with:
- Automatic optimization
- CDN delivery
- Responsive image variants
- Secure signed URLs

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px (tablet), 480px (mobile)
- Touch-friendly buttons and forms
- Optimized for all screen sizes

## 🎨 Customization

### Colors
Edit CSS variables in `public/css/style.css`:
```css
:root {
  --primary-neon: #00ff41;      /* Neon green */
  --secondary-cyan: #00d9ff;    /* Cyan */
  --dark-bg: #0a0e27;           /* Dark background */
  /* ... more variables */
}
```

### Admin Panel Path
Change `ADMIN_PANEL_PATH` in `.env.local` to any secret path

### Credit Costs
Edit credit deduction logic in `api/posts/create.js`

## 🚀 Performance Tips

- Static HTML/CSS/JS loads instantly
- Serverless functions scale automatically
- Database queries optimized with indexes
- Images optimized via Cloudinary
- Caching headers configured

## 🐛 Troubleshooting

### "Unauthorized" errors
- Check JWT_SECRET matches between frontend and backend
- Verify token is being sent in Authorization header

### Database connection errors
- Verify SUPABASE_URL and SUPABASE_KEY are correct
- Check database is running and accessible
- Verify IP whitelist in Supabase settings

### Image upload fails
- Check Cloudinary credentials
- Verify file size < 5MB
- Check CORS settings

### Admin panel not accessible
- Verify ADMIN_PANEL_PATH is correct
- Check admin password hash is set
- Clear browser cache and cookies

## 📚 API Documentation

See `api/` directory for detailed endpoint documentation in each file.

### Key Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/posts/create` - Create post (requires auth + credits)
- `GET /api/posts/list` - List posts with filters
- `GET /api/posts/[id]` - Get post detail
- `POST /api/posts/[id]/like` - Like post
- `POST /api/posts/[id]/comments` - Add comment
- `PUT /api/admin/users/[id]/credits` - Update user credits (admin only)

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please follow the code style and submit pull requests.

## 📧 Support

For issues and questions, please open a GitHub issue or contact the maintainers.

---

**Built with ⚡ for the hacker community**
