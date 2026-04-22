# 🚀 MRT International - Deployment Package

This folder contains everything you need to deploy MRT International to Hostinger Business Plan.

## 📁 Files Overview

### 1. **HOSTINGER-DEPLOYMENT-GUIDE.md**
Complete step-by-step deployment guide with:
- Database setup instructions
- File upload methods
- Server configuration
- Security hardening
- Monitoring setup
- Troubleshooting guide

### 2. **mysql-schema.sql**
Production-ready MySQL database schema with:
- All required tables
- Proper indexes for performance
- Foreign key relationships
- Default admin user
- UTF-8 character support

### 3. **seed-categories-products.sql**
Sample data based on your product document:
- 7 categories (Home & Kitchen, Beauty, Health, etc.)
- Category themes with colors and SEO content
- 30 products across categories
- Badges (Top Pick, Trending, Editor's Choice)
- Affiliate links included

### 4. **pre-deployment-checklist.sh**
Automated verification script to run BEFORE deployment:
- Checks all required files exist
- Verifies build is complete
- Validates directory structure
- Ensures dependencies are installed

### 5. **post-deployment-test.sh**
Automated testing script to run AFTER deployment:
- Tests all API endpoints
- Verifies frontend pages load
- Checks admin panel access
- Validates database connections
- Confirms PM2 process running

## 🎯 Quick Start Guide

### Step 1: Pre-Deployment (Local Machine)

```bash
# Navigate to project root
cd Ecommerce-101-main

# Make scripts executable
chmod +x deployment/*.sh

# Run pre-deployment checklist
./deployment/pre-deployment-checklist.sh

# If checks pass, build the project
npm install
npm run build
```

### Step 2: Database Setup (Hostinger)

1. **Create MySQL Database in hPanel**
   - Go to Databases → MySQL Databases
   - Create new database (e.g., `u123456789_mrt`)
   - Create user with strong password
   - Grant ALL PRIVILEGES

2. **Import Schema**
   ```bash
   # Via SSH
   mysql -u your_db_user -p your_db_name < deployment/mysql-schema.sql
   
   # Or use phpMyAdmin in hPanel
   ```

3. **Import Sample Data (Optional)**
   ```bash
   mysql -u your_db_user -p your_db_name < deployment/seed-categories-products.sql
   ```

### Step 3: Upload Files (Hostinger)

**Option A: Git (Recommended)**
```bash
ssh u123456789@your-domain.com
cd domains/your-domain.com/public_html
git clone https://github.com/yourusername/your-repo.git .
```

**Option B: File Manager**
- Upload via hPanel File Manager
- Upload: server/, dist/, prisma/, package.json, ecosystem.config.js

**Option C: FTP/SFTP**
- Use FileZilla or similar
- Upload all project files

### Step 4: Configure Environment

```bash
# SSH into server
ssh u123456789@your-domain.com
cd domains/your-domain.com/public_html

# Create .env file
nano .env
```

**Paste this (update with your values):**
```env
DATABASE_URL="mysql://your_db_user:your_password@localhost:3306/your_db_name"
JWT_SECRET="generate_random_32_char_string"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your_secure_password"
NODE_ENV="production"
PORT=3001
```

### Step 5: Install & Start

```bash
# Install dependencies
npm install --production

# Generate Prisma client
npx prisma generate

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 6: Test Deployment

```bash
# Run post-deployment tests
./deployment/post-deployment-test.sh your-domain.com

# Or test manually
curl https://your-domain.com/health
curl https://your-domain.com/api/categories
```

## 🔧 Configuration Files

### Update Prisma for MySQL

Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Nginx Configuration (if needed)

See `HOSTINGER-DEPLOYMENT-GUIDE.md` for complete Nginx setup.

Key points:
- Proxy `/api` requests to `localhost:3001`
- Serve static files from `dist/`
- Enable SSL (Hostinger provides free SSL)

## 📊 Database Schema Overview

### Core Tables
- **Category** - Product categories with slugs
- **CategoryTheme** - Visual themes and SEO content
- **Product** - Products with affiliate links
- **Review** - Customer reviews
- **Testimonial** - Social proof testimonials
- **User** - Admin users
- **AffiliateClick** - Click tracking
- **WishlistItem** - User wishlists
- **ComparisonItem** - Product comparisons
- **NewsletterSub** - Email subscriptions

### Relationships
```
Category (1) ←→ (many) Product
Category (1) ←→ (1) CategoryTheme
Product (1) ←→ (many) Review
Product (1) ←→ (many) AffiliateClick
```

## 🎨 Sample Data Structure

The seed data includes:

### Categories (7)
1. Home & Kitchen
2. Beauty & Personal Care
3. Health & Wellness
4. Pet Supplies
5. Baby & Kids Essentials
6. Electronics & Accessories
7. Sports & Fitness

### Products per Category
- **Top Picks** (4 products)
- **Trending Now** (3-4 products)
- **Editor's Choice** (2-3 products)

Each product includes:
- Name and slug
- Short benefit description
- Price
- Badge (Top Pick/Trending/Editor's Choice)
- Affiliate URL (Amazon links from your document)
- Rating (4.5-4.8)
- Key benefits (JSON array)
- Tags (JSON array)

## 🔐 Security Checklist

- [ ] Strong database password
- [ ] Secure JWT_SECRET (32+ characters)
- [ ] Strong admin password
- [ ] File permissions set correctly (600 for .env)
- [ ] SSL certificate enabled
- [ ] Firewall configured
- [ ] Rate limiting enabled (built-in)
- [ ] CORS configured for production domain

## 📈 Monitoring

### PM2 Commands
```bash
pm2 status                    # Check status
pm2 logs mrt-international    # View logs
pm2 restart mrt-international # Restart app
pm2 monit                     # Real-time monitoring
```

### Database Backups
```bash
# Manual backup
mysqldump -u user -p database > backup_$(date +%Y%m%d).sql

# Automated backup (see deployment guide)
```

### Log Files
- PM2 logs: `~/.pm2/logs/`
- Nginx logs: `/var/log/nginx/`
- Application logs: Check PM2 logs

## 🆘 Troubleshooting

### Server won't start
```bash
pm2 logs mrt-international --lines 50
# Check for errors in .env or database connection
```

### Database connection fails
```bash
mysql -u your_user -p your_database
# Test connection manually
```

### 502 Bad Gateway
```bash
pm2 status  # Ensure app is running
sudo nginx -t  # Test Nginx config
sudo systemctl restart nginx
```

### Admin panel not accessible
- Check `dist/admin/` files exist
- Verify Nginx/Apache routes `/admin` correctly
- Check browser console for errors

## 📞 Support

- **Hostinger Support**: https://www.hostinger.com/support
- **Deployment Guide**: See `HOSTINGER-DEPLOYMENT-GUIDE.md`
- **PM2 Docs**: https://pm2.keymetrics.io/docs/
- **Prisma Docs**: https://www.prisma.io/docs/

## ✅ Deployment Checklist

- [ ] Pre-deployment script passed
- [ ] Database created and schema imported
- [ ] Sample data imported (optional)
- [ ] Files uploaded to server
- [ ] .env file configured
- [ ] Dependencies installed
- [ ] Prisma client generated
- [ ] PM2 process started
- [ ] Nginx/Apache configured
- [ ] SSL enabled
- [ ] Post-deployment tests passed
- [ ] Admin panel accessible
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Affiliate links working

## 🎉 Success!

Once all checks pass, your MRT International platform is live!

**Access Points:**
- Frontend: `https://your-domain.com`
- Admin Panel: `https://your-domain.com/admin`
- API Health: `https://your-domain.com/health`

**Next Steps:**
1. Login to admin panel
2. Customize categories and products
3. Update affiliate links
4. Test all functionality
5. Monitor performance

---

**Need Help?** Refer to `HOSTINGER-DEPLOYMENT-GUIDE.md` for detailed instructions.
