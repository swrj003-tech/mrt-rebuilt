# 📐 MRT International - Deployment Structure

## 🏗️ Server Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HOSTINGER SERVER                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              Nginx (Port 80/443)                │    │
│  │  - SSL Termination                              │    │
│  │  - Static File Serving                          │    │
│  │  - Reverse Proxy                                │    │
│  └────────────────────────────────────────────────┘    │
│           │                           │                  │
│           │                           │                  │
│           ▼                           ▼                  │
│  ┌─────────────────┐       ┌──────────────────────┐    │
│  │  Static Files   │       │   Node.js Backend    │    │
│  │   (dist/)       │       │   (PM2 Managed)      │    │
│  │                 │       │   Port: 3001         │    │
│  │  - index.html   │       │                      │    │
│  │  - admin/       │       │  - Express Server    │    │
│  │  - assets/      │       │  - API Routes        │    │
│  │  - CSS/JS       │       │  - Auth Middleware   │    │
│  └─────────────────┘       └──────────────────────┘    │
│                                      │                   │
│                                      │                   │
│                                      ▼                   │
│                          ┌────────────────────┐         │
│                          │   MySQL Database   │         │
│                          │   Port: 3306       │         │
│                          │                    │         │
│                          │  - Categories      │         │
│                          │  - Products        │         │
│                          │  - Users           │         │
│                          │  - Reviews         │         │
│                          └────────────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure on Server

```
/home/u123456789/domains/your-domain.com/public_html/
│
├── 📁 server/                    # Backend application
│   ├── index.js                  # Main server file
│   ├── db.js                     # Prisma client
│   ├── 📁 routes/                # API routes
│   │   ├── products.js           # Product CRUD
│   │   ├── categories.js         # Category CRUD
│   │   ├── admin.js              # Admin endpoints
│   │   ├── auth.js               # Authentication
│   │   ├── reviews.js            # Reviews
│   │   ├── testimonials.js       # Testimonials
│   │   ├── wishlist.js           # Wishlist
│   │   ├── comparison.js         # Comparison
│   │   ├── newsletter.js         # Newsletter
│   │   ├── affiliate.js          # Click tracking
│   │   └── media.js              # File uploads
│   └── 📁 middleware/            # Middleware
│       ├── auth.js               # JWT auth
│       └── cache.js              # Caching
│
├── 📁 dist/                      # Frontend build (served by Nginx)
│   ├── index.html                # Homepage
│   ├── categories.html           # Categories page
│   ├── category.html             # Single category
│   ├── about.html                # About page
│   ├── contact.html              # Contact page
│   ├── 📁 admin/                 # Admin panel
│   │   ├── index.html            # Admin dashboard
│   │   ├── app.js                # Admin JS
│   │   └── style.css             # Admin CSS
│   └── 📁 assets/                # Static assets
│       ├── 📁 images/            # Images
│       ├── 📁 css/               # Stylesheets
│       ├── 📁 js/                # JavaScript
│       └── 📁 uploads/           # User uploads
│
├── 📁 prisma/                    # Database configuration
│   └── schema.prisma             # Database schema
│
├── 📁 src/                       # Source files
│   └── 📁 generated/             # Prisma client
│       └── 📁 client/            # Generated client
│
├── 📁 node_modules/              # Dependencies
│
├── 📁 deployment/                # Deployment files
│   ├── mysql-schema.sql          # Database schema
│   ├── seed-categories-products.sql  # Sample data
│   ├── pre-deployment-checklist.sh   # Pre-check script
│   ├── post-deployment-test.sh       # Test script
│   ├── HOSTINGER-DEPLOYMENT-GUIDE.md # Full guide
│   └── README.md                 # Package overview
│
├── .env                          # Environment variables (CREATE THIS)
├── package.json                  # Dependencies
├── package-lock.json             # Lock file
└── ecosystem.config.js           # PM2 configuration
```

---

## 🔄 Request Flow

### Frontend Request (Static Files)
```
User Browser
    │
    ▼
https://your-domain.com/
    │
    ▼
Nginx (Port 443)
    │
    ▼
Serve from: /public_html/dist/index.html
    │
    ▼
User Browser (HTML + CSS + JS)
```

### API Request (Dynamic Data)
```
User Browser
    │
    ▼
https://your-domain.com/api/products
    │
    ▼
Nginx (Port 443)
    │
    ▼
Reverse Proxy to: http://localhost:3001/api/products
    │
    ▼
Node.js Express Server (PM2)
    │
    ▼
Prisma ORM
    │
    ▼
MySQL Database
    │
    ▼
JSON Response
    │
    ▼
User Browser
```

### Admin Request (CMS)
```
Admin Browser
    │
    ▼
https://your-domain.com/admin
    │
    ▼
Nginx (Port 443)
    │
    ▼
Serve from: /public_html/dist/admin/index.html
    │
    ▼
Admin Panel Loads
    │
    ▼
Admin makes API call: POST /api/products
    │
    ▼
JWT Authentication Middleware
    │
    ▼
Admin-Only Middleware
    │
    ▼
Create Product in Database
    │
    ▼
Return Success Response
```

---

## 🗄️ Database Structure

```
MySQL Database: u123456789_mrt
│
├── 📊 Category
│   ├── id (INT, PK)
│   ├── name (VARCHAR)
│   ├── slug (VARCHAR, UNIQUE)
│   ├── image (VARCHAR)
│   ├── sortOrder (INT)
│   └── timestamps
│
├── 📊 CategoryTheme
│   ├── id (INT, PK)
│   ├── categoryId (INT, FK → Category)
│   ├── primary (VARCHAR)
│   ├── secondary (VARCHAR)
│   ├── title (VARCHAR)
│   ├── subtitle (VARCHAR)
│   ├── seoTitle (VARCHAR)
│   └── seoIntro (TEXT)
│
├── 📊 Product
│   ├── id (INT, PK)
│   ├── name (VARCHAR)
│   ├── slug (VARCHAR, UNIQUE)
│   ├── description (TEXT)
│   ├── shortBenefit (VARCHAR)
│   ├── price (DECIMAL)
│   ├── image (VARCHAR)
│   ├── badge (VARCHAR)
│   ├── affiliateUrl (VARCHAR)
│   ├── categoryId (INT, FK → Category)
│   ├── ratingValue (DECIMAL)
│   ├── tags (JSON)
│   ├── keyBenefits (JSON)
│   ├── isActive (BOOLEAN)
│   ├── sortOrder (INT)
│   └── timestamps
│
├── 📊 Review
│   ├── id (INT, PK)
│   ├── productId (INT, FK → Product)
│   ├── userName (VARCHAR)
│   ├── rating (INT)
│   ├── comment (TEXT)
│   ├── isVerified (BOOLEAN)
│   └── createdAt
│
├── 📊 User
│   ├── id (INT, PK)
│   ├── email (VARCHAR, UNIQUE)
│   ├── passwordHash (VARCHAR)
│   ├── name (VARCHAR)
│   ├── role (VARCHAR)
│   └── timestamps
│
├── 📊 Testimonial
│   ├── id (INT, PK)
│   ├── name (VARCHAR)
│   ├── location (VARCHAR)
│   ├── quote (TEXT)
│   ├── rating (INT)
│   ├── sortOrder (INT)
│   └── createdAt
│
├── 📊 AffiliateClick
│   ├── id (INT, PK)
│   ├── productId (INT, FK → Product)
│   ├── clickedAt (DATETIME)
│   ├── ip (VARCHAR)
│   └── userAgent (VARCHAR)
│
├── 📊 WishlistItem
│   ├── id (INT, PK)
│   ├── userId (INT)
│   ├── deviceId (VARCHAR)
│   ├── productId (INT, FK → Product)
│   └── createdAt
│
├── 📊 ComparisonItem
│   ├── id (INT, PK)
│   ├── userId (INT)
│   ├── deviceId (VARCHAR)
│   ├── productId (INT, FK → Product)
│   └── createdAt
│
└── 📊 NewsletterSub
    ├── id (INT, PK)
    ├── email (VARCHAR, UNIQUE)
    └── createdAt
```

---

## 🔐 Environment Configuration

```
.env File Location: /public_html/.env

Required Variables:
┌─────────────────────────────────────────────────────┐
│ DATABASE_URL="mysql://user:pass@localhost:3306/db" │
│ JWT_SECRET="your_32_char_random_string"            │
│ ADMIN_EMAIL="admin@yourdomain.com"                 │
│ ADMIN_PASSWORD="your_secure_password"              │
│ NODE_ENV="production"                              │
│ PORT=3001                                          │
│ PRODUCTION_URL="https://your-domain.com"           │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Process Management (PM2)

```
PM2 Process: mrt-international
│
├── 📊 Status
│   ├── Name: mrt-international
│   ├── Mode: fork
│   ├── PID: [auto-assigned]
│   ├── Status: online
│   ├── Restart: 0
│   ├── Uptime: [runtime]
│   ├── CPU: [usage]
│   └── Memory: [usage]
│
├── 📁 Logs
│   ├── Out: ~/.pm2/logs/mrt-international-out.log
│   └── Error: ~/.pm2/logs/mrt-international-error.log
│
└── 🔄 Commands
    ├── Start: pm2 start ecosystem.config.js
    ├── Stop: pm2 stop mrt-international
    ├── Restart: pm2 restart mrt-international
    ├── Logs: pm2 logs mrt-international
    ├── Monitor: pm2 monit
    └── Status: pm2 status
```

---

## 🌐 Nginx Configuration

```nginx
Server Block Structure:

┌─────────────────────────────────────────────────┐
│  HTTP (Port 80)                                 │
│  → Redirect to HTTPS                            │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  HTTPS (Port 443)                               │
│                                                 │
│  Location: /                                    │
│  → Serve static files from dist/               │
│  → SPA fallback to index.html                  │
│                                                 │
│  Location: /api                                 │
│  → Proxy to http://localhost:3001              │
│  → Set proxy headers                           │
│                                                 │
│  Location: /admin                               │
│  → Serve from dist/admin/                      │
│  → Fallback to admin/index.html                │
│                                                 │
│  Location: /health                              │
│  → Proxy to http://localhost:3001/health       │
└─────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Example

### Creating a Product via CMS

```
1. Admin Login
   ┌─────────────────────────────────────┐
   │ POST /api/auth/login                │
   │ Body: { email, password }           │
   │ Response: { token, user }           │
   └─────────────────────────────────────┘
                │
                ▼
2. Create Product
   ┌─────────────────────────────────────┐
   │ POST /api/products                  │
   │ Headers: Authorization: Bearer JWT  │
   │ Body: {                             │
   │   name: "Product Name",             │
   │   price: 29.99,                     │
   │   categoryId: 1,                    │
   │   affiliateUrl: "https://...",      │
   │   badge: "Top Pick",                │
   │   keyBenefits: ["...", "...", "..."]│
   │ }                                   │
   └─────────────────────────────────────┘
                │
                ▼
3. Middleware Chain
   ┌─────────────────────────────────────┐
   │ authMiddleware()                    │
   │ → Verify JWT token                  │
   │ → Attach user to request            │
   └─────────────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────┐
   │ adminOnly()                         │
   │ → Check user.role === 'ADMIN'       │
   │ → Allow or reject                   │
   └─────────────────────────────────────┘
                │
                ▼
4. Database Insert
   ┌─────────────────────────────────────┐
   │ prisma.product.create()             │
   │ → Generate slug                     │
   │ → Stringify JSON fields             │
   │ → Insert into MySQL                 │
   └─────────────────────────────────────┘
                │
                ▼
5. Response
   ┌─────────────────────────────────────┐
   │ Status: 201 Created                 │
   │ Body: { id, name, slug, ... }       │
   └─────────────────────────────────────┘
                │
                ▼
6. Frontend Update
   ┌─────────────────────────────────────┐
   │ Admin panel refreshes product list  │
   │ New product appears immediately     │
   └─────────────────────────────────────┘
```

---

## 🔄 Deployment Workflow

```
┌─────────────────────────────────────────────────────────┐
│                   LOCAL MACHINE                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Run pre-deployment checklist                        │
│     ./deployment/pre-deployment-checklist.sh            │
│                                                          │
│  2. Build project                                       │
│     npm install                                         │
│     npm run build                                       │
│                                                          │
│  3. Commit and push to Git                              │
│     git add .                                           │
│     git commit -m "Ready for deployment"                │
│     git push origin main                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  HOSTINGER SERVER                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  4. Create MySQL database (hPanel)                      │
│                                                          │
│  5. SSH into server                                     │
│     ssh u123456789@your-domain.com                      │
│                                                          │
│  6. Clone repository                                    │
│     git clone https://github.com/user/repo.git .        │
│                                                          │
│  7. Import database schema                              │
│     mysql -u user -p db < deployment/mysql-schema.sql   │
│                                                          │
│  8. Configure environment                               │
│     nano .env                                           │
│                                                          │
│  9. Update Prisma for MySQL                             │
│     nano prisma/schema.prisma                           │
│                                                          │
│  10. Install dependencies                               │
│      npm install --production                           │
│                                                          │
│  11. Generate Prisma client                             │
│      npx prisma generate                                │
│                                                          │
│  12. Start with PM2                                     │
│      pm2 start ecosystem.config.js                      │
│      pm2 save                                           │
│      pm2 startup                                        │
│                                                          │
│  13. Configure Nginx                                    │
│      (Setup reverse proxy)                              │
│                                                          │
│  14. Enable SSL                                         │
│      (Via hPanel)                                       │
│                                                          │
│  15. Run post-deployment tests                          │
│      ./deployment/post-deployment-test.sh               │
│                                                          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    LIVE WEBSITE                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ✅ Frontend: https://your-domain.com                   │
│  ✅ Admin: https://your-domain.com/admin                │
│  ✅ API: https://your-domain.com/api                    │
│  ✅ Health: https://your-domain.com/health              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 Monitoring & Maintenance

```
Daily Tasks:
├── Check PM2 status: pm2 status
├── View logs: pm2 logs mrt-international
└── Monitor resources: pm2 monit

Weekly Tasks:
├── Database backup
├── Review analytics
├── Check error logs
└── Update content

Monthly Tasks:
├── Update dependencies: npm update
├── Security audit: npm audit
├── Performance review
└── Backup verification
```

---

This structure ensures a robust, scalable, and maintainable deployment on Hostinger Business Plan.
