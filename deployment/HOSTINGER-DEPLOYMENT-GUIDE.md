# 🚀 MRT International - Complete Hostinger Deployment Guide for Beginners

## 👋 Welcome!

This guide assumes you have **ZERO knowledge** about Hostinger. I'll walk you through every single step with detailed explanations.

---

## 📋 What You Need Before Starting

### Required:
- ✅ **Hostinger Business Plan** (purchased and active)
- ✅ **Domain name** (either purchased through Hostinger or connected from another provider)
- ✅ **This project files** (the Ecommerce-101-main folder)
- ✅ **Computer with internet** (Windows, Mac, or Linux)

### Optional but Helpful:
- FileZilla or another FTP client (we'll show you how to use Hostinger's built-in file manager)
- Text editor (Notepad++, VS Code, or even Windows Notepad)

---

## 🎯 Deployment Overview (What We'll Do)

Here's the big picture of what we're going to accomplish:

1. **Access Hostinger** - Log into your Hostinger account
2. **Create Database** - Set up a MySQL database for your products
3. **Upload Files** - Get your website files onto Hostinger's server
4. **Configure Settings** - Set up passwords and connections
5. **Install Software** - Install Node.js and required packages
6. **Start Website** - Launch your website
7. **Test Everything** - Make sure it all works

**Total Time**: About 45-60 minutes (first time)

---

## 🔐 STEP 0: Access Your Hostinger Account

### What is Hostinger hPanel?
hPanel is Hostinger's control panel - think of it as the "dashboard" where you control everything about your website.

### How to Access:

1. **Open your web browser** (Chrome, Firefox, Safari, etc.)

2. **Go to**: https://hpanel.hostinger.com

3. **Login** with:
   - Email: The email you used to sign up for Hostinger
   - Password: Your Hostinger password

4. **You should see**: A dashboard with various options like "Websites", "Email", "Domains", etc.

**✅ Checkpoint**: You're now in hPanel. Keep this tab open - we'll use it throughout this guide.

---

## 🗄️ STEP 1: Create MySQL Database

### What is a Database?
A database stores all your website data (products, categories, users, etc.). Think of it as a digital filing cabinet.

### Step 1.1: Navigate to Databases

1. **In hPanel**, look at the left sidebar
2. **Click on** "Databases" (it has a database icon 🗄️)
3. **You'll see**: "MySQL Databases" section

### Step 1.2: Create New Database

1. **Click** the blue button that says **"Create New Database"** or **"+ Create"**

2. **Fill in the form**:
   
   **Database Name**: 
   ```
   mrt_ecommerce
   ```
   *(Note: Hostinger will add a prefix like "u123456789_" automatically)*
   
   **Database Username**: 
   ```
   mrt_admin
   ```
   *(Hostinger will also add a prefix to this)*
   
   **Database Password**: 
   ```
   Click "Generate Password" button
   ```
   *(This creates a strong, secure password)*
   
   **⚠️ IMPORTANT**: Click the **"Copy"** button next to the password and paste it into a text file on your computer. You'll need this later!

3. **Click** "Create" button

4. **You should see**: A success message and your new database listed

### Step 1.3: Save Your Database Credentials

**Open Notepad** (or any text editor) and save this information:

```
DATABASE CREDENTIALS (SAVE THIS!)
================================
Database Name: u123456789_mrt_ecommerce
Database User: u123456789_mrt_admin
Database Password: [the password you copied]
Database Host: localhost
Database Port: 3306
```

**Save this file** as `database-credentials.txt` on your desktop.

**✅ Checkpoint**: You now have a MySQL database created. The database is empty right now - we'll fill it with tables in Step 3.

---

## 📤 STEP 2: Upload Your Project Files

### What Are We Uploading?
We need to upload your website files (HTML, JavaScript, images, etc.) to Hostinger's server.

### Method 1: Using Hostinger File Manager (Easiest for Beginners)

#### Step 2.1: Access File Manager

1. **In hPanel**, click on **"Files"** in the left sidebar
2. **Click** on **"File Manager"**
3. **A new tab opens**: This is your file manager (like Windows Explorer, but for your website)

#### Step 2.2: Navigate to Your Website Folder

1. **You'll see folders** like: `domains`, `public_html`, etc.
2. **Double-click** on `domains`
3. **Double-click** on your domain name (e.g., `your-domain.com`)
4. **Double-click** on `public_html`

**This is your website's root folder** - everything here is accessible on the internet.

#### Step 2.3: Clear Default Files (If Any)

1. **If you see files** like `index.html`, `default.html`, or a "Coming Soon" page
2. **Select them** (click the checkbox next to each file)
3. **Click** the **"Delete"** button at the top
4. **Confirm** deletion

#### Step 2.4: Upload Project Files

**On your computer**:

1. **Navigate to** your `Ecommerce-101-main` folder
2. **You need to upload these folders and files**:
   - `server/` folder
   - `dist/` folder
   - `prisma/` folder
   - `src/` folder
   - `package.json` file
   - `package-lock.json` file
   - `ecosystem.config.js` file

**In File Manager**:

1. **Click** the **"Upload Files"** button (top right)
2. **Select** the folders and files listed above
3. **Wait** for upload to complete (this may take 5-10 minutes depending on your internet speed)

**⚠️ Note**: File Manager might not upload folders directly. If that's the case, use Method 2 below.

### Method 2: Using FTP (Alternative Method)

If File Manager doesn't work well for folders, use FTP:

#### Step 2.5: Get FTP Credentials

1. **In hPanel**, go to **"Files"** → **"FTP Accounts"**
2. **You'll see** your FTP credentials:
   - **FTP Host**: ftp.your-domain.com
   - **FTP Username**: u123456789
   - **FTP Password**: (click "Change Password" if you don't know it)

#### Step 2.6: Download FileZilla (Free FTP Client)

1. **Go to**: https://filezilla-project.org/download.php?type=client
2. **Download** FileZilla Client (free)
3. **Install** it on your computer

#### Step 2.7: Connect with FileZilla

1. **Open FileZilla**
2. **At the top**, fill in:
   - **Host**: ftp.your-domain.com
   - **Username**: u123456789 (your FTP username)
   - **Password**: (your FTP password)
   - **Port**: 21
3. **Click** "Quickconnect"

#### Step 2.8: Upload Files via FTP

1. **Left side** = Your computer
2. **Right side** = Hostinger server
3. **On the right**, navigate to: `domains/your-domain.com/public_html`
4. **On the left**, navigate to your `Ecommerce-101-main` folder
5. **Select** the folders: `server`, `dist`, `prisma`, `src`
6. **Select** the files: `package.json`, `package-lock.json`, `ecosystem.config.js`
7. **Right-click** → **Upload**
8. **Wait** for upload to complete

**✅ Checkpoint**: Your project files are now on Hostinger's server.

---

## 🗄️ STEP 3: Import Database Schema

### What is a Database Schema?
The schema is like a blueprint - it creates the structure (tables, columns) where your data will be stored.

### Step 3.1: Access phpMyAdmin

1. **In hPanel**, go to **"Databases"** → **"MySQL Databases"**
2. **Find your database** in the list
3. **Click** the **"Manage"** button next to it (or "Enter phpMyAdmin")
4. **A new tab opens**: This is phpMyAdmin (a tool to manage your database)

### Step 3.2: Select Your Database

1. **On the left sidebar**, you'll see your database name: `u123456789_mrt_ecommerce`
2. **Click on it**
3. **You should see**: "No tables found in database" (that's normal - we're about to create them)

### Step 3.3: Import the Schema File

1. **Click** the **"Import"** tab at the top

2. **Click** "Choose File" button

3. **Navigate to** your `Ecommerce-101-main/deployment/` folder

4. **Select** the file: `mysql-schema.sql`

5. **Click** "Open"

6. **Scroll down** and click the **"Go"** button at the bottom

7. **Wait** for the import to complete (should take 5-10 seconds)

8. **You should see**: "Import has been successfully finished" in green

### Step 3.4: Verify Tables Were Created

1. **Click** on your database name again in the left sidebar
2. **You should now see** 10 tables:
   - AffiliateClick
   - Category
   - CategoryTheme
   - ComparisonItem
   - NewsletterSub
   - Product
   - Review
   - Testimonial
   - User
   - WishlistItem

**✅ Checkpoint**: Your database now has the structure to store products, categories, and more!

### Step 3.5: Import Sample Data (Optional but Recommended)

This adds 7 categories and 30 products to your database so you can see how it works.

1. **Still in phpMyAdmin**, click the **"Import"** tab again

2. **Click** "Choose File"

3. **Select**: `Ecommerce-101-main/deployment/seed-categories-products.sql`

4. **Click** "Go"

5. **You should see**: Success message

6. **To verify**, click on the **"Product"** table in the left sidebar

7. **Click** the **"Browse"** tab

8. **You should see**: 30 products listed

**✅ Checkpoint**: Your database now has sample products and categories!

---

## ⚙️ STEP 4: Configure Environment Variables

### What Are Environment Variables?
These are secret settings (like passwords) that your website needs to work. We store them in a file called `.env`.

### Step 4.1: Access SSH Terminal

**What is SSH?** It's a way to type commands directly on Hostinger's server (like using Command Prompt or Terminal).

#### Enable SSH Access:

1. **In hPanel**, go to **"Advanced"** → **"SSH Access"**

2. **If SSH is disabled**:
   - Click **"Enable SSH Access"**
   - Set a password (or use the one shown)
   - **Save this password** in your `database-credentials.txt` file

3. **You'll see**:
   - **SSH Host**: ssh.your-domain.com
   - **SSH Port**: 65002 (or similar)
   - **SSH Username**: u123456789

#### Connect to SSH:

**On Windows**:
1. **Press** `Windows Key + R`
2. **Type**: `cmd` and press Enter
3. **Type** this command (replace with your details):
   ```bash
   ssh u123456789@ssh.your-domain.com -p 65002
   ```
4. **Press Enter**
5. **Type** "yes" when asked about fingerprint
6. **Enter** your SSH password

**On Mac/Linux**:
1. **Open** Terminal
2. **Type** the same SSH command above
3. **Follow** the same steps

**✅ You're now connected!** You should see a command prompt like: `u123456789@server:~$`

### Step 4.2: Navigate to Your Website Folder

**Type these commands** (press Enter after each):

```bash
cd domains/your-domain.com/public_html
```

**To verify you're in the right place**, type:
```bash
ls
```

**You should see**: Your folders listed (server, dist, prisma, etc.)

### Step 4.3: Create the .env File

**Type this command**:
```bash
nano .env
```

**This opens a text editor** in the terminal.

### Step 4.4: Add Your Configuration

**Copy and paste this** (use right-click to paste in terminal):

```env
# Database Configuration
DATABASE_URL="mysql://u123456789_mrt_admin:YOUR_DATABASE_PASSWORD@localhost:3306/u123456789_mrt_ecommerce"

# Security
JWT_SECRET="REPLACE_THIS_WITH_RANDOM_STRING"
NODE_ENV="production"

# Admin Credentials
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="YourSecurePassword123!"

# Server Configuration
PORT=3001

# Production URL
PRODUCTION_URL="https://your-domain.com"
```

**Now REPLACE these values**:

1. **YOUR_DATABASE_PASSWORD**: Replace with the database password you saved earlier

2. **REPLACE_THIS_WITH_RANDOM_STRING**: We'll generate this in the next step

3. **admin@yourdomain.com**: Replace with your actual email

4. **YourSecurePassword123!**: Choose a strong password for admin login

5. **your-domain.com**: Replace with your actual domain

### Step 4.5: Generate JWT Secret

**Don't close the .env file yet!** We need to generate a secure random string.

**Open a NEW terminal/command prompt window** (keep the SSH one open)

**Type**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**You'll get** something like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

**Copy this string**

**Go back to your SSH window** with the .env file open

**Replace** `REPLACE_THIS_WITH_RANDOM_STRING` with the string you just copied

### Step 4.6: Save the .env File

**Press**: `Ctrl + X` (or `Cmd + X` on Mac)

**Type**: `Y` (for "Yes, save")

**Press**: `Enter`

**✅ Checkpoint**: Your .env file is created with all the necessary configuration!

---

## 🔧 STEP 5: Update Prisma for MySQL

### What is Prisma?
Prisma is a tool that helps your website talk to the database. We need to tell it we're using MySQL (not SQLite).

### Step 5.1: Edit Prisma Schema

**In your SSH terminal**, type:

```bash
nano prisma/schema.prisma
```

### Step 5.2: Find and Change the Datasource

**Look for this section** (near the top):

```prisma
datasource db {
  provider = "sqlite"
}
```

**Change it to**:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Step 5.3: Save the File

**Press**: `Ctrl + X`

**Type**: `Y`

**Press**: `Enter`

**✅ Checkpoint**: Prisma is now configured for MySQL!

---

## 📦 STEP 6: Install Node.js and Dependencies

### What is Node.js?
Node.js is the software that runs your website's backend. Think of it as the engine that powers your website.

### Step 6.1: Check if Node.js is Installed

**In SSH**, type:

```bash
node -v
```

**If you see** a version number like `v18.17.0` or `v20.x.x`:
- ✅ Node.js is installed! Skip to Step 6.3

**If you see** "command not found":
- ❌ Node.js is not installed. Continue to Step 6.2

### Step 6.2: Install Node.js (If Needed)

**Contact Hostinger Support** to install Node.js:

1. **In hPanel**, click the **chat icon** (bottom right)
2. **Tell them**: "Please install Node.js 18 or higher on my hosting account"
3. **Wait** for them to install it (usually takes 10-30 minutes)
4. **Once done**, verify with `node -v` again

**Alternative**: Some Hostinger plans have Node.js in a different location. Try:

```bash
/usr/local/bin/node -v
```

### Step 6.3: Install Project Dependencies

**Make sure you're in the right folder**:

```bash
cd ~/domains/your-domain.com/public_html
pwd
```

**Install dependencies** (this downloads all the code libraries your website needs):

```bash
npm install --production
```

**This will take 3-5 minutes**. You'll see lots of text scrolling - that's normal!

**✅ When done**, you should see: "added XXX packages"

### Step 6.4: Generate Prisma Client

**Type**:

```bash
npx prisma generate
```

**This creates** the code that connects your website to the database.

**You should see**: "✔ Generated Prisma Client"

**✅ Checkpoint**: All software is installed and ready!

---

## 🚀 STEP 7: Start Your Website with PM2

### What is PM2?
PM2 keeps your website running 24/7. If it crashes, PM2 automatically restarts it.

### Step 7.1: Install PM2

**Type**:

```bash
npm install -g pm2
```

**Wait** for installation to complete.

### Step 7.2: Start Your Website

**Type**:

```bash
pm2 start ecosystem.config.js
```

**You should see**: A table showing your app is "online"

### Step 7.3: Save PM2 Configuration

**Type**:

```bash
pm2 save
```

**This saves** your app so PM2 remembers it.

### Step 7.4: Setup Auto-Start on Reboot

**Type**:

```bash
pm2 startup
```

**You'll see** a command to run. **Copy and paste** that command and press Enter.

**Example** (yours will be different):
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u u123456789 --hp /home/u123456789
```

### Step 7.5: Verify Your Website is Running

**Type**:

```bash
pm2 status
```

**You should see**:
- **Name**: mrt-international
- **Status**: online (in green)
- **Restart**: 0

**To see logs** (to check if everything is working):

```bash
pm2 logs mrt-international --lines 20
```

**You should see**: "[server] MRT International backend running on http://localhost:3001"

**✅ Checkpoint**: Your website backend is running!

---

## 🌐 STEP 8: Configure Web Server (Nginx)

### What is Nginx?
Nginx is the web server that receives requests from visitors and sends them to your website. We need to configure it to work with your Node.js backend.

### Step 8.1: Contact Hostinger Support for Nginx Configuration

**Why?** Hostinger Business plans have Nginx pre-configured, but we need to add custom rules for your Node.js app.

**Option A: Use Hostinger's Node.js App Manager (Easiest)**

1. **In hPanel**, look for **"Advanced"** → **"Node.js"** or **"Node.js App Manager"**

2. **If available**, click **"Create Application"**

3. **Fill in**:
   - **Application Root**: `/domains/your-domain.com/public_html`
   - **Application URL**: `https://your-domain.com`
   - **Application Startup File**: `server/index.js`
   - **Port**: `3001`

4. **Click** "Create"

5. **Hostinger will automatically** configure Nginx for you!

**Option B: Manual Nginx Configuration**

If Node.js App Manager is not available, you'll need to configure Nginx manually.

### Step 8.2: Create Nginx Configuration File

**In SSH**, type:

```bash
nano ~/nginx.conf
```

**Paste this configuration**:

```nginx
# MRT International - Nginx Configuration

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (Hostinger manages this automatically)
    # ssl_certificate and ssl_certificate_key are set by Hostinger

    # Root directory for static files
    root /home/u123456789/domains/your-domain.com/public_html/dist;
    index index.html;

    # Serve static files directly
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin panel
    location /admin {
        try_files $uri $uri/ /admin/index.html;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
    }

    # Static assets caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**IMPORTANT**: Replace:
- `your-domain.com` with your actual domain (in 3 places)
- `u123456789` with your actual Hostinger username

**Save**: `Ctrl + X`, `Y`, `Enter`

### Step 8.3: Apply Nginx Configuration

**Contact Hostinger Support**:

1. **Open chat** in hPanel (bottom right)

2. **Send this message**:
   ```
   Hello! I need help configuring Nginx for my Node.js application.
   
   I have created a custom Nginx configuration file at:
   /home/u123456789/nginx.conf
   
   Could you please:
   1. Review and apply this configuration
   2. Test the Nginx configuration
   3. Reload Nginx
   
   My domain is: your-domain.com
   My Node.js app runs on port 3001
   
   Thank you!
   ```

3. **Wait** for support to apply the configuration (usually 10-30 minutes)

**Alternative**: If you have root access, you can do it yourself:

```bash
sudo cp ~/nginx.conf /etc/nginx/sites-available/your-domain.com
sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**✅ Checkpoint**: Nginx is configured to route traffic to your website!

---

## 🔐 STEP 9: Enable SSL Certificate (HTTPS)

### What is SSL?
SSL makes your website secure (the padlock icon in the browser). It's essential for e-commerce sites.

### Step 9.1: Enable Free SSL in Hostinger

1. **In hPanel**, go to **"Websites"**

2. **Click** on your domain

3. **Look for** "SSL" section (usually on the left or in "Advanced")

4. **Click** "SSL"

5. **You'll see** options:
   - Free SSL (Let's Encrypt) - **Choose this one**
   - Custom SSL
   - No SSL

6. **Click** "Install" or "Enable" next to "Free SSL"

7. **Wait** 5-15 minutes for SSL to activate

8. **You'll see**: "SSL is active" with a green checkmark

### Step 9.2: Force HTTPS

1. **Still in SSL settings**, look for **"Force HTTPS"** option

2. **Toggle it ON**

3. **This ensures** all visitors use the secure HTTPS version

**✅ Checkpoint**: Your website now has a secure HTTPS connection!

---

## 🧪 STEP 10: Test Your Deployment

### Step 10.1: Test Backend API

**Open your web browser** and visit these URLs (replace with your domain):

1. **Health Check**:
   ```
   https://your-domain.com/health
   ```
   **You should see**: `{"status":"OK","message":"MRT International Server is healthy"}`

2. **Categories API**:
   ```
   https://your-domain.com/api/categories
   ```
   **You should see**: JSON data with categories

3. **Products API**:
   ```
   https://your-domain.com/api/products
   ```
   **You should see**: JSON data with products

### Step 10.2: Test Frontend

1. **Homepage**:
   ```
   https://your-domain.com
   ```
   **You should see**: Your website homepage

2. **Categories Page**:
   ```
   https://your-domain.com/categories.html
   ```
   **You should see**: List of categories

3. **About Page**:
   ```
   https://your-domain.com/about.html
   ```
   **You should see**: About page

### Step 10.3: Test Admin Panel

1. **Visit**:
   ```
   https://your-domain.com/admin
   ```

2. **You should see**: Admin login page

3. **Login with**:
   - Email: The ADMIN_EMAIL you set in .env
   - Password: The ADMIN_PASSWORD you set in .env

4. **You should see**: Admin dashboard

5. **Try creating a category**:
   - Click "Categories" in sidebar
   - Click "Add New Category"
   - Fill in the form
   - Click "Save"
   - **Verify**: Category appears in the list

6. **Try creating a product**:
   - Click "Products" in sidebar
   - Click "Add New Product"
   - Fill in the form
   - Click "Save"
   - **Verify**: Product appears in the list

### Step 10.4: Run Automated Tests (Optional)

**In SSH**, run:

```bash
cd ~/domains/your-domain.com/public_html
chmod +x deployment/post-deployment-test.sh
./deployment/post-deployment-test.sh your-domain.com
```

**This will test** all endpoints automatically and show you a report.

**✅ Checkpoint**: Everything is working! Your website is live!

---

## 📊 STEP 11: Monitor Your Website

### Step 11.1: Check PM2 Status

**In SSH**, type:

```bash
pm2 status
```

**You should see**: Your app is "online"

### Step 11.2: View Logs

**To see what's happening**:

```bash
pm2 logs mrt-international
```

**To see last 50 lines**:

```bash
pm2 logs mrt-international --lines 50
```

**To see only errors**:

```bash
pm2 logs mrt-international --err
```

### Step 11.3: Monitor Resources

**To see CPU and memory usage**:

```bash
pm2 monit
```

**Press** `Ctrl + C` to exit

### Step 11.4: Restart Your Website (If Needed)

**If something goes wrong**:

```bash
pm2 restart mrt-international
```

**To stop**:

```bash
pm2 stop mrt-international
```

**To start again**:

```bash
pm2 start mrt-international
```

---

## 🔄 STEP 12: Update Your Website (Future Updates)

### When You Make Changes to Your Code

**In SSH**:

```bash
# Navigate to your website folder
cd ~/domains/your-domain.com/public_html

# Pull latest code (if using Git)
git pull origin main

# Install any new dependencies
npm install --production

# Rebuild frontend (if you changed frontend code)
npm run build

# Regenerate Prisma client (if you changed database schema)
npx prisma generate

# Restart the application
pm2 restart mrt-international

# Check logs to ensure it restarted successfully
pm2 logs mrt-international --lines 20
```

---

## 🔐 STEP 13: Security Best Practices

### Step 13.1: Change Default Admin Password

1. **Login to admin panel**: `https://your-domain.com/admin`

2. **Go to** Settings or Profile

3. **Change** your admin password to something very strong

4. **Use**: At least 16 characters, mix of letters, numbers, symbols

### Step 13.2: Secure File Permissions

**In SSH**:

```bash
cd ~/domains/your-domain.com/public_html

# Secure .env file
chmod 600 .env

# Secure directories
chmod 755 server/ dist/ prisma/

# Secure server files
chmod 644 server/*.js
```

### Step 13.3: Setup Database Backups

**Create a backup script**:

```bash
nano ~/backup-database.sh
```

**Paste this**:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backups"
mkdir -p $BACKUP_DIR

mysqldump -u u123456789_mrt_admin -p'YOUR_DB_PASSWORD' u123456789_mrt_ecommerce > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql"
```

**Replace**: `YOUR_DB_PASSWORD` with your actual database password

**Save**: `Ctrl + X`, `Y`, `Enter`

**Make executable**:

```bash
chmod +x ~/backup-database.sh
```

**Test it**:

```bash
~/backup-database.sh
```

**Schedule daily backups**:

```bash
crontab -e
```

**Add this line** (runs daily at 2 AM):

```
0 2 * * * /home/u123456789/backup-database.sh
```

**Save**: `Ctrl + X`, `Y`, `Enter`

---

## 🆘 Troubleshooting Common Issues

### Issue 1: "Cannot connect to database"

**Symptoms**: Website shows database error

**Solutions**:

1. **Check .env file**:
   ```bash
   cat .env | grep DATABASE_URL
   ```
   **Verify**: Username, password, database name are correct

2. **Test database connection**:
   ```bash
   mysql -u u123456789_mrt_admin -p u123456789_mrt_ecommerce
   ```
   **Enter** your database password
   **If it works**: Database is fine, check .env
   **If it fails**: Password is wrong, reset it in hPanel

3. **Check if MySQL is running**:
   ```bash
   systemctl status mysql
   ```

### Issue 2: "502 Bad Gateway"

**Symptoms**: Website shows 502 error

**Solutions**:

1. **Check if Node.js app is running**:
   ```bash
   pm2 status
   ```
   **If stopped**: Start it with `pm2 start mrt-international`

2. **Check logs for errors**:
   ```bash
   pm2 logs mrt-international --lines 50
   ```

3. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

### Issue 3: "Admin panel shows 404"

**Symptoms**: /admin page not found

**Solutions**:

1. **Check if dist/admin/ folder exists**:
   ```bash
   ls -la dist/admin/
   ```
   **If missing**: You need to build the frontend

2. **Rebuild frontend**:
   ```bash
   npm run build
   ```

3. **Check Nginx configuration** for /admin location block

### Issue 4: "PM2 not found"

**Symptoms**: `pm2: command not found`

**Solutions**:

1. **Install PM2 globally**:
   ```bash
   npm install -g pm2
   ```

2. **If still not found**, try:
   ```bash
   npx pm2 status
   ```

### Issue 5: "Port 3001 already in use"

**Symptoms**: Cannot start server, port in use

**Solutions**:

1. **Find what's using the port**:
   ```bash
   lsof -i :3001
   ```

2. **Kill the process**:
   ```bash
   kill -9 [PID]
   ```
   **Replace [PID]** with the process ID from previous command

3. **Or change port** in .env file to 3002 or another port

### Issue 6: "npm install fails"

**Symptoms**: Errors during npm install

**Solutions**:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and try again**:
   ```bash
   rm -rf node_modules
   npm install --production
   ```

3. **Check Node.js version**:
   ```bash
   node -v
   ```
   **Should be**: v18.x.x or higher

---

## 📞 Getting Help from Hostinger Support

### When to Contact Support

- Node.js installation issues
- Nginx configuration problems
- SSL certificate issues
- Server access problems
- Performance issues

### How to Contact Support

1. **In hPanel**, click the **chat icon** (bottom right)

2. **Or go to**: https://www.hostinger.com/support

3. **Provide them with**:
   - Your domain name
   - Description of the problem
   - Error messages (if any)
   - What you've already tried

### What to Ask For

**Example message**:

```
Hello! I'm deploying a Node.js application on my Business plan.

Domain: your-domain.com
Issue: [describe your issue]

I need help with:
1. [specific request]
2. [specific request]

Error message: [paste error if any]

Thank you!
```

---

## ✅ Final Checklist

### Deployment Complete When:

- [ ] Database created and schema imported
- [ ] Sample data imported (optional)
- [ ] All files uploaded to server
- [ ] .env file configured correctly
- [ ] Prisma configured for MySQL
- [ ] Dependencies installed
- [ ] Prisma client generated
- [ ] PM2 process running and saved
- [ ] Nginx configured
- [ ] SSL certificate active
- [ ] Health endpoint returns OK
- [ ] API endpoints return data
- [ ] Frontend pages load
- [ ] Admin panel accessible
- [ ] Can login to admin
- [ ] Can create categories
- [ ] Can create products
- [ ] Changes appear on frontend
- [ ] Backups scheduled

---

## 🎉 Congratulations!

Your MRT International e-commerce platform is now live on Hostinger!

### What You've Accomplished:

✅ Set up a MySQL database  
✅ Uploaded and configured your website  
✅ Installed Node.js and dependencies  
✅ Started your website with PM2  
✅ Configured Nginx web server  
✅ Enabled SSL for security  
✅ Tested everything works  
✅ Set up monitoring and backups  

### Next Steps:

1. **Customize your content**:
   - Login to admin panel
   - Add/edit categories
   - Add/edit products
   - Update affiliate links

2. **Test thoroughly**:
   - Try all features
   - Test on mobile devices
   - Check all links work

3. **Monitor regularly**:
   - Check PM2 status daily
   - Review logs for errors
   - Monitor traffic and performance

4. **Keep updated**:
   - Update dependencies monthly
   - Backup database weekly
   - Review security settings

---

## 📚 Additional Resources

- **Hostinger Knowledge Base**: https://support.hostinger.com
- **Hostinger Community**: https://www.hostinger.com/community
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Prisma Documentation**: https://www.prisma.io/docs/
- **Node.js Documentation**: https://nodejs.org/docs/

---

## 🔗 Quick Reference Commands

### PM2 Commands
```bash
pm2 status                    # Check status
pm2 logs mrt-international    # View logs
pm2 restart mrt-international # Restart app
pm2 stop mrt-international    # Stop app
pm2 start mrt-international   # Start app
pm2 monit                     # Monitor resources
pm2 save                      # Save configuration
```

### Database Commands
```bash
# Login to MySQL
mysql -u u123456789_mrt_admin -p u123456789_mrt_ecommerce

# Backup database
mysqldump -u user -p database > backup.sql

# Restore database
mysql -u user -p database < backup.sql
```

### File Management
```bash
# Navigate to website folder
cd ~/domains/your-domain.com/public_html

# List files
ls -la

# View file content
cat filename

# Edit file
nano filename

# Check disk space
df -h

# Check folder size
du -sh *
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx
```

---

**Need more help?** Refer back to the troubleshooting section or contact Hostinger support.

**Good luck with your e-commerce platform!** 🚀

### 1.1 Create Database via hPanel

1. Log into **Hostinger hPanel**
2. Navigate to **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Database Name: `u123456789_mrt` (or your preferred name)
5. Create a database user with a strong password
6. Grant **ALL PRIVILEGES** to the user
7. **Save credentials securely**

### 1.2 Import Database Schema

**Option A: Via hPanel phpMyAdmin**
1. Go to **Databases** → **phpMyAdmin**
2. Select your database from the left sidebar
3. Click **Import** tab
4. Choose file: `deployment/mysql-schema.sql`
5. Click **Go** to execute

**Option B: Via SSH (Recommended)**
```bash
# Connect to your Hostinger server via SSH
ssh u123456789@your-domain.com

# Navigate to your project directory
cd domains/your-domain.com/public_html

# Import the schema
mysql -u u123456789_mrt_user -p u123456789_mrt < deployment/mysql-schema.sql
# Enter your database password when prompted
```

### 1.3 Verify Database Tables
```sql
-- Login to MySQL
mysql -u u123456789_mrt_user -p u123456789_mrt

-- Check tables
SHOW TABLES;

-- Should show:
-- AffiliateClick, Category, CategoryTheme, ComparisonItem, 
-- NewsletterSub, Product, Review, Testimonial, User, WishlistItem

-- Exit MySQL
EXIT;
```

---

## 📦 STEP 2: Upload Project Files

### 2.1 Prepare Local Build
```bash
# On your local machine, in the project directory
cd Ecommerce-101-main

# Install dependencies
npm install

# Build the frontend
npm run build

# This creates the 'dist' folder with optimized files
```

### 2.2 Upload Files to Hostinger

**Option A: Via File Manager (hPanel)**
1. Go to **Files** → **File Manager**
2. Navigate to `domains/your-domain.com/public_html`
3. Upload these folders/files:
   - `server/` (entire folder)
   - `dist/` (entire folder)
   - `prisma/` (entire folder)
   - `src/generated/` (entire folder)
   - `node_modules/` (or install on server)
   - `package.json`
   - `package-lock.json`
   - `ecosystem.config.js`
   - `.env` (create this on server)

**Option B: Via Git (Recommended)**
```bash
# SSH into your server
ssh u123456789@your-domain.com

# Navigate to web root
cd domains/your-domain.com/public_html

# Clone your repository
git clone https://github.com/yourusername/your-repo.git .

# Or if already cloned, pull latest
git pull origin main
```

**Option C: Via FTP/SFTP**
- Use FileZilla or similar FTP client
- Connect using credentials from hPanel
- Upload all project files

---

## ⚙️ STEP 3: Server Configuration

### 3.1 Create Production Environment File
```bash
# SSH into server
ssh u123456789@your-domain.com
cd domains/your-domain.com/public_html

# Create .env file
nano .env
```

**Paste this configuration (update with your actual values):**
```env
# Database Configuration
DATABASE_URL="mysql://u123456789_mrt_user:YOUR_DB_PASSWORD@localhost:3306/u123456789_mrt"

# Security
JWT_SECRET="GENERATE_A_LONG_RANDOM_STRING_HERE_MIN_32_CHARS"
NODE_ENV="production"

# Admin Credentials
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="YOUR_SECURE_ADMIN_PASSWORD"

# Server Configuration
PORT=3001

# Optional: Production URL for CORS
PRODUCTION_URL="https://your-domain.com"
```

**Save and exit:** `CTRL+X`, then `Y`, then `ENTER`

### 3.2 Generate Secure JWT Secret
```bash
# Generate a random 32-character string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and paste it as JWT_SECRET in .env
```

### 3.3 Update Prisma Configuration

Create `prisma.config.ts` in the root directory:
```bash
nano prisma.config.ts
```

**Paste this:**
```typescript
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasources: {
    db: {
      provider: 'mysql',
      url: process.env.DATABASE_URL
    }
  }
});
```

### 3.4 Update Prisma Schema for MySQL

Edit `prisma/schema.prisma`:
```bash
nano prisma/schema.prisma
```

**Change the datasource section:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

---

## 📦 STEP 4: Install Dependencies & Generate Prisma Client

```bash
# Ensure you're in the project directory
cd domains/your-domain.com/public_html

# Install Node.js dependencies
npm install --production

# Generate Prisma Client for MySQL
npx prisma generate

# Verify Prisma Client generation
ls -la src/generated/client/
```

---

## 🚀 STEP 5: Start the Application with PM2

### 5.1 Install PM2 (if not already installed)
```bash
npm install -g pm2
```

### 5.2 Start the Application
```bash
# Start using ecosystem config
pm2 start ecosystem.config.js

# Or start directly
pm2 start server/index.js --name "mrt-international"

# Save PM2 process list
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
# Follow the command it outputs
```

### 5.3 Verify Application is Running
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs mrt-international

# Check if server is responding
curl http://localhost:3001/health
# Should return: {"status":"OK","message":"MRT International Server is healthy"}
```

---

## 🌐 STEP 6: Configure Nginx/Apache Reverse Proxy

### For Nginx (Hostinger typically uses Nginx)

Create or edit Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/your-domain.com
```

**Add this configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (Hostinger auto-manages this)
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Root directory for static files
    root /home/u123456789/domains/your-domain.com/public_html/dist;
    index index.html;

    # Serve static files directly
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin panel
    location /admin {
        try_files $uri $uri/ /admin/index.html;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
    }

    # Static assets caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable the site and reload Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Alternative: Using .htaccess (if Apache is used)

Create `.htaccess` in `public_html`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Proxy API requests to Node.js
    RewriteCond %{REQUEST_URI} ^/api
    RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]

    # Proxy health check
    RewriteCond %{REQUEST_URI} ^/health
    RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]

    # Serve static files from dist
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /dist/$1 [L]

    # SPA fallback
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /dist/index.html [L]
</IfModule>
```

---

## 🔐 STEP 7: Security Hardening

### 7.1 Secure File Permissions
```bash
# Set proper ownership
chown -R u123456789:u123456789 /home/u123456789/domains/your-domain.com/public_html

# Secure .env file
chmod 600 .env

# Secure directories
chmod 755 server/ dist/ prisma/
chmod 644 server/*.js
```

### 7.2 Enable Firewall Rules
```bash
# Allow only necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 7.3 Setup SSL Certificate
Hostinger typically provides free SSL via Let's Encrypt:
1. Go to hPanel → **SSL**
2. Enable **Free SSL** for your domain
3. Wait for activation (usually 5-10 minutes)

---

## 🧪 STEP 8: Testing & Verification

### 8.1 Test Backend API
```bash
# Health check
curl https://your-domain.com/health

# Test categories endpoint
curl https://your-domain.com/api/categories

# Test products endpoint
curl https://your-domain.com/api/products
```

### 8.2 Test Admin Panel
1. Visit: `https://your-domain.com/admin`
2. Login with credentials from `.env`
3. Try creating a category
4. Try creating a product
5. Verify changes appear on frontend

### 8.3 Test Frontend
1. Visit: `https://your-domain.com`
2. Check all pages load correctly
3. Test category navigation
4. Test product cards and affiliate links
5. Test contact form

---

## 📊 STEP 9: Monitoring & Maintenance

### 9.1 PM2 Monitoring
```bash
# View real-time logs
pm2 logs mrt-international

# Monitor CPU/Memory usage
pm2 monit

# Restart application
pm2 restart mrt-international

# Stop application
pm2 stop mrt-international

# View detailed info
pm2 info mrt-international
```

### 9.2 Database Backups
```bash
# Create backup script
nano ~/backup-db.sh
```

**Paste this:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/u123456789/backups"
mkdir -p $BACKUP_DIR

mysqldump -u u123456789_mrt_user -p'YOUR_DB_PASSWORD' u123456789_mrt > $BACKUP_DIR/mrt_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mrt_backup_*.sql" -mtime +7 -delete

echo "Backup completed: mrt_backup_$DATE.sql"
```

**Make executable and schedule:**
```bash
chmod +x ~/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add this line:
0 2 * * * /home/u123456789/backup-db.sh
```

### 9.3 Application Logs
```bash
# View PM2 logs
pm2 logs --lines 100

# View error logs only
pm2 logs --err

# Clear logs
pm2 flush
```

---

## 🔄 STEP 10: Deployment Updates

### For Future Updates:
```bash
# SSH into server
ssh u123456789@your-domain.com
cd domains/your-domain.com/public_html

# Pull latest code
git pull origin main

# Install new dependencies
npm install --production

# Rebuild frontend
npm run build

# Regenerate Prisma client if schema changed
npx prisma generate

# Restart application
pm2 restart mrt-international

# Verify
pm2 logs mrt-international
```

---

## 🆘 Troubleshooting

### Issue: Server won't start
```bash
# Check logs
pm2 logs mrt-international --lines 50

# Check if port is in use
netstat -tulpn | grep 3001

# Verify .env file
cat .env

# Test database connection
npx prisma db pull
```

### Issue: Database connection fails
```bash
# Test MySQL connection
mysql -u u123456789_mrt_user -p u123456789_mrt

# Verify DATABASE_URL format
echo $DATABASE_URL

# Check MySQL is running
sudo systemctl status mysql
```

### Issue: 502 Bad Gateway
```bash
# Check if Node.js app is running
pm2 status

# Check Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: Admin panel not accessible
```bash
# Verify admin files exist
ls -la dist/admin/

# Check Nginx/Apache configuration for /admin route

# Verify admin credentials in .env
cat .env | grep ADMIN
```

---

## 📞 Support Resources

- **Hostinger Support**: https://www.hostinger.com/support
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Prisma Documentation**: https://www.prisma.io/docs/
- **Node.js Documentation**: https://nodejs.org/docs/

---

## ✅ Post-Deployment Checklist

- [ ] Database schema imported successfully
- [ ] All tables created and verified
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Prisma client generated
- [ ] PM2 process running
- [ ] Nginx/Apache configured
- [ ] SSL certificate active
- [ ] Frontend accessible
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] Affiliate links working
- [ ] Database backups scheduled
- [ ] Monitoring setup complete

---

## 🎉 Congratulations!

Your MRT International e-commerce platform is now live on Hostinger!

**Next Steps:**
1. Populate categories using the admin panel
2. Add products with affiliate links
3. Customize category themes
4. Test all functionality
5. Monitor performance and logs

**Admin Panel:** `https://your-domain.com/admin`
**API Health:** `https://your-domain.com/health`
