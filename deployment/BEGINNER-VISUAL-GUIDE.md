# 🎨 Visual Guide for Complete Beginners

## 📍 Where to Find Things in Hostinger hPanel

### Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  HOSTINGER hPanel                          [Profile] 👤 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐                                       │
│  │  SIDEBAR     │         MAIN CONTENT AREA             │
│  │              │                                        │
│  │ 🏠 Dashboard │    Your websites and services         │
│  │ 🌐 Websites  │    appear here                        │
│  │ 📧 Email     │                                        │
│  │ 🗄️  Databases│                                        │
│  │ 📁 Files     │                                        │
│  │ 🔧 Advanced  │                                        │
│  │ 💬 Support   │                                        │
│  └──────────────┘                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Step-by-Step: Creating a Database

### Visual Flow:

```
1. Click "Databases" in sidebar
   ↓
2. You see: "MySQL Databases" section
   ↓
3. Click blue "Create New Database" button
   ↓
4. Fill in form:
   ┌─────────────────────────────────┐
   │ Database Name: mrt_ecommerce    │
   │ Username: mrt_admin             │
   │ Password: [Generate Password]   │
   │                                 │
   │        [Create] button          │
   └─────────────────────────────────┘
   ↓
5. Success! Database created
   ↓
6. SAVE these credentials in a text file!
```

---

## 📤 Step-by-Step: Uploading Files

### Method 1: File Manager (Visual)

```
1. Click "Files" in sidebar
   ↓
2. Click "File Manager"
   ↓
3. New tab opens showing folders:
   
   📁 domains
   📁 logs
   📁 mail
   📁 public_html
   📁 tmp
   
   ↓
4. Double-click: domains
   ↓
5. Double-click: your-domain.com
   ↓
6. Double-click: public_html
   
   ⚠️ YOU ARE HERE - This is your website folder!
   
   ↓
7. Click "Upload Files" button (top right)
   ↓
8. Select your project folders:
   ✓ server/
   ✓ dist/
   ✓ prisma/
   ✓ src/
   ✓ package.json
   ✓ ecosystem.config.js
   
   ↓
9. Wait for upload (5-10 minutes)
   ↓
10. Done! Files are on server
```

### Method 2: FTP with FileZilla (Visual)

```
FileZilla Window Layout:
┌─────────────────────────────────────────────────────────┐
│ Host: ftp.your-domain.com  User: u123456789  Port: 21  │
│                    [Quickconnect]                        │
├──────────────────────┬──────────────────────────────────┤
│   YOUR COMPUTER      │      HOSTINGER SERVER            │
│                      │                                  │
│  📁 Documents        │  📁 domains                      │
│  📁 Downloads        │  📁 logs                         │
│  📁 Ecommerce-101    │  📁 public_html ← DRAG HERE     │
│    📁 server ←DRAG   │                                  │
│    📁 dist   ←DRAG   │                                  │
│    📁 prisma ←DRAG   │                                  │
│                      │                                  │
└──────────────────────┴──────────────────────────────────┘

Steps:
1. Left side = Your computer
2. Right side = Hostinger server
3. Navigate right side to: public_html
4. Drag folders from left to right
5. Wait for upload
```

---

## 💻 Step-by-Step: Using SSH Terminal

### What SSH Looks Like:

```
Before connecting:
┌─────────────────────────────────────┐
│ C:\Users\YourName>                  │
│ _                                   │
└─────────────────────────────────────┘

After typing SSH command:
┌─────────────────────────────────────┐
│ C:\Users\YourName> ssh u123456789@  │
│ ssh.your-domain.com -p 65002        │
│                                     │
│ Password: ****                      │
│                                     │
│ Welcome to Hostinger!               │
│ u123456789@server:~$                │
│ _                                   │
└─────────────────────────────────────┘

Now you're connected! ✅
```

### Common SSH Commands Explained:

```
Command: cd domains/your-domain.com/public_html
What it does: Changes directory (like double-clicking a folder)
Visual: You → domains folder → your-domain.com → public_html

Command: ls
What it does: Lists files (like viewing folder contents)
Visual: Shows: server/ dist/ prisma/ package.json etc.

Command: nano .env
What it does: Opens text editor (like opening Notepad)
Visual: Opens file for editing

Command: pwd
What it does: Shows current location
Visual: Prints: /home/u123456789/domains/your-domain.com/public_html
```

---

## 📝 Step-by-Step: Creating .env File

### Visual Process:

```
1. In SSH, type: nano .env
   ↓
2. You see a blank editor:
   ┌─────────────────────────────────────┐
   │ GNU nano 4.8    .env                │
   ├─────────────────────────────────────┤
   │                                     │
   │ _                                   │
   │                                     │
   │                                     │
   │                                     │
   │                                     │
   ├─────────────────────────────────────┤
   │ ^X Exit  ^O Save                    │
   └─────────────────────────────────────┘
   
   ↓
3. Paste your configuration:
   ┌─────────────────────────────────────┐
   │ GNU nano 4.8    .env                │
   ├─────────────────────────────────────┤
   │ DATABASE_URL="mysql://..."          │
   │ JWT_SECRET="abc123..."              │
   │ ADMIN_EMAIL="admin@domain.com"      │
   │ ADMIN_PASSWORD="SecurePass123!"     │
   │ NODE_ENV="production"               │
   │ PORT=3001                           │
   │ _                                   │
   ├─────────────────────────────────────┤
   │ ^X Exit  ^O Save                    │
   └─────────────────────────────────────┘
   
   ↓
4. Press: Ctrl + X
   ↓
5. You see: "Save modified buffer?"
   ┌─────────────────────────────────────┐
   │ Save modified buffer?               │
   │  Y Yes                              │
   │  N No                               │
   │  ^C Cancel                          │
   └─────────────────────────────────────┘
   
   ↓
6. Press: Y
   ↓
7. You see: "File Name to Write: .env"
   ┌─────────────────────────────────────┐
   │ File Name to Write: .env            │
   │ [Press Enter to confirm]            │
   └─────────────────────────────────────┘
   
   ↓
8. Press: Enter
   ↓
9. Done! File saved ✅
```

---

## 🗄️ Step-by-Step: Importing Database Schema

### Visual Flow in phpMyAdmin:

```
1. In hPanel → Databases → Click "Manage"
   ↓
2. phpMyAdmin opens:
   ┌─────────────────────────────────────────────────┐
   │ phpMyAdmin                                      │
   ├──────────────┬──────────────────────────────────┤
   │ DATABASES    │  Welcome to phpMyAdmin           │
   │              │                                  │
   │ ▼ u123_mrt   │  Select a database from left     │
   │   (empty)    │                                  │
   │              │                                  │
   └──────────────┴──────────────────────────────────┘
   
   ↓
3. Click on your database name (left sidebar)
   ↓
4. Click "Import" tab (top menu)
   ┌─────────────────────────────────────────────────┐
   │ [Structure] [SQL] [Search] [Import] [Export]    │
   ├─────────────────────────────────────────────────┤
   │ File to import:                                 │
   │ [Choose File] No file selected                  │
   │                                                 │
   │ Format: SQL                                     │
   │                                                 │
   │              [Go] button                        │
   └─────────────────────────────────────────────────┘
   
   ↓
5. Click "Choose File"
   ↓
6. Select: mysql-schema.sql
   ↓
7. Click "Go" button
   ↓
8. Wait 5-10 seconds...
   ↓
9. Success message appears:
   ┌─────────────────────────────────────────────────┐
   │ ✓ Import has been successfully finished,        │
   │   10 queries executed.                          │
   └─────────────────────────────────────────────────┘
   
   ↓
10. Click database name again (left sidebar)
    ↓
11. You now see 10 tables:
    ┌──────────────┐
    │ Tables       │
    ├──────────────┤
    │ AffiliateClick│
    │ Category     │
    │ CategoryTheme│
    │ ComparisonItem│
    │ NewsletterSub│
    │ Product      │
    │ Review       │
    │ Testimonial  │
    │ User         │
    │ WishlistItem │
    └──────────────┘
    
    ✅ Database structure created!
```

---

## 🚀 Step-by-Step: Starting with PM2

### Visual Command Flow:

```
1. In SSH terminal:
   u123456789@server:~/public_html$ pm2 start ecosystem.config.js
   
   ↓
   
2. You see PM2 starting:
   ┌─────────────────────────────────────────────────┐
   │ [PM2] Starting ecosystem.config.js              │
   │ [PM2] Process launched                          │
   │                                                 │
   │ ┌──────┬────────────┬─────────┬────────┬───┐  │
   │ │ id   │ name       │ mode    │ status │...│  │
   │ ├──────┼────────────┼─────────┼────────┼───┤  │
   │ │ 0    │ mrt-inter..│ fork    │ online │...│  │
   │ └──────┴────────────┴─────────┴────────┴───┘  │
   └─────────────────────────────────────────────────┘
   
   ✅ Status: online (in green) = SUCCESS!
   ❌ Status: errored (in red) = PROBLEM!
   
   ↓
   
3. Save configuration:
   u123456789@server:~/public_html$ pm2 save
   
   ┌─────────────────────────────────────────────────┐
   │ [PM2] Saving current process list...           │
   │ [PM2] Successfully saved in ~/.pm2/dump.pm2     │
   └─────────────────────────────────────────────────┘
   
   ✅ Configuration saved!
```

---

## 🌐 Step-by-Step: Testing Your Website

### Visual Testing Checklist:

```
Open Browser → Type URL → See Result

Test 1: Health Check
┌─────────────────────────────────────────┐
│ https://your-domain.com/health          │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ {"status":"OK","message":"...healthy"}  │
└─────────────────────────────────────────┘
✅ Backend is working!

Test 2: Homepage
┌─────────────────────────────────────────┐
│ https://your-domain.com                 │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  🏠 MRT International                   │
│  ─────────────────────────              │
│  Welcome to our store!                  │
│  [Browse Categories]                    │
└─────────────────────────────────────────┘
✅ Frontend is working!

Test 3: Admin Panel
┌─────────────────────────────────────────┐
│ https://your-domain.com/admin           │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  🔐 Admin Login                         │
│  ─────────────────                      │
│  Email: [____________]                  │
│  Password: [____________]               │
│  [Login]                                │
└─────────────────────────────────────────┘
✅ Admin panel is accessible!
```

---

## 🎯 Quick Reference: Where Everything Is

### On Your Computer:
```
📁 Ecommerce-101-main/
├── 📁 deployment/
│   ├── 📄 mysql-schema.sql ← Import this to database
│   ├── 📄 seed-categories-products.sql ← Sample data
│   └── 📄 HOSTINGER-DEPLOYMENT-GUIDE.md ← Full guide
├── 📁 server/ ← Backend code
├── 📁 dist/ ← Frontend files
├── 📁 prisma/ ← Database config
└── 📄 package.json ← Dependencies list
```

### On Hostinger Server:
```
📁 /home/u123456789/
├── 📁 domains/
│   └── 📁 your-domain.com/
│       └── 📁 public_html/ ← YOUR WEBSITE IS HERE
│           ├── 📁 server/
│           ├── 📁 dist/
│           ├── 📁 prisma/
│           ├── 📄 .env ← Your secrets
│           └── 📄 package.json
└── 📁 backups/ ← Database backups go here
```

### In Hostinger hPanel:
```
🏠 Dashboard
   ├── 🌐 Websites → Manage your domain
   ├── 🗄️  Databases → Create/manage MySQL
   ├── 📁 Files → File Manager & FTP
   ├── 🔧 Advanced
   │   ├── SSH Access → Enable terminal
   │   ├── SSL → Enable HTTPS
   │   └── Node.js → (if available)
   └── 💬 Support → Chat with Hostinger
```

---

## 🔑 Important Credentials to Save

### Create a file called "credentials.txt" and save:

```
═══════════════════════════════════════════
  MRT INTERNATIONAL - DEPLOYMENT CREDENTIALS
═══════════════════════════════════════════

🌐 DOMAIN
Domain: your-domain.com
Registrar: Hostinger

🗄️  DATABASE
Database Name: u123456789_mrt_ecommerce
Database User: u123456789_mrt_admin
Database Password: [paste here]
Database Host: localhost
Database Port: 3306
phpMyAdmin: https://hpanel.hostinger.com → Databases

💻 SSH ACCESS
SSH Host: ssh.your-domain.com
SSH Port: 65002
SSH Username: u123456789
SSH Password: [paste here]
Command: ssh u123456789@ssh.your-domain.com -p 65002

📁 FTP ACCESS
FTP Host: ftp.your-domain.com
FTP Port: 21
FTP Username: u123456789
FTP Password: [paste here]

🔐 ADMIN PANEL
URL: https://your-domain.com/admin
Email: admin@yourdomain.com
Password: [paste here]

🔑 JWT SECRET
[paste your generated secret here]

═══════════════════════════════════════════
⚠️  KEEP THIS FILE SECURE - DO NOT SHARE!
═══════════════════════════════════════════
```

---

## ✅ Success Indicators

### How to Know Everything is Working:

```
✅ Database Created
   → You see it listed in hPanel → Databases
   → phpMyAdmin shows 10 tables

✅ Files Uploaded
   → File Manager shows: server/, dist/, prisma/ folders
   → package.json file is visible

✅ .env File Created
   → In SSH: cat .env shows your configuration
   → No "file not found" error

✅ Dependencies Installed
   → node_modules/ folder exists
   → No errors during npm install

✅ PM2 Running
   → pm2 status shows "online" in green
   → pm2 logs shows "backend running on port 3001"

✅ Website Live
   → https://your-domain.com loads
   → https://your-domain.com/health returns OK
   → https://your-domain.com/admin shows login

✅ SSL Active
   → Browser shows padlock 🔒 icon
   → URL starts with https:// (not http://)

✅ Admin Works
   → Can login to admin panel
   → Can create categories
   → Can create products
   → Changes appear on frontend
```

---

## 🆘 Visual Troubleshooting

### Problem: Can't connect to SSH

```
❌ Error: "Connection refused"

Check:
1. Is SSH enabled in hPanel?
   hPanel → Advanced → SSH Access → [Enabled?]

2. Are you using the correct port?
   Command should be: ssh user@host -p 65002
   (Not port 22!)

3. Is your password correct?
   Reset it in hPanel if needed
```

### Problem: Database connection fails

```
❌ Error: "Access denied for user"

Check:
1. Is DATABASE_URL correct in .env?
   mysql://USER:PASSWORD@localhost:3306/DATABASE
   
2. Did you replace placeholders?
   ❌ YOUR_PASSWORD
   ✅ actual_password_here

3. Test connection manually:
   mysql -u u123_mrt_admin -p u123_mrt_ecommerce
```

### Problem: Website shows 502 error

```
❌ Error: "502 Bad Gateway"

Check:
1. Is PM2 running?
   pm2 status
   Should show: online (green)
   
2. If stopped, start it:
   pm2 start mrt-international
   
3. Check logs for errors:
   pm2 logs mrt-international
```

---

## 📞 When to Contact Hostinger Support

### Contact Support For:

```
✅ Node.js installation
✅ Nginx configuration
✅ SSL certificate issues
✅ Server access problems
✅ Performance issues

❌ Don't contact for:
❌ Code errors (check PM2 logs first)
❌ Database queries (use phpMyAdmin)
❌ Frontend issues (check browser console)
```

### How to Contact:

```
1. Click chat icon in hPanel (bottom right)
   💬

2. Or visit: https://www.hostinger.com/support

3. Provide:
   - Your domain
   - Clear description
   - Error messages
   - What you tried
```

---

## 🎓 Learning Resources

### Understand the Technologies:

```
📚 Node.js
What: JavaScript runtime for backend
Learn: https://nodejs.org/en/learn/

📚 MySQL
What: Database to store your data
Learn: https://www.mysqltutorial.org/

📚 PM2
What: Process manager to keep app running
Learn: https://pm2.keymetrics.io/docs/

📚 Nginx
What: Web server that handles requests
Learn: https://nginx.org/en/docs/beginners_guide.html

📚 SSH
What: Secure way to access server terminal
Learn: https://www.hostinger.com/tutorials/ssh-tutorial-how-does-ssh-work
```

---

**This visual guide complements the main deployment guide. Use them together for best results!**

**Main Guide**: `HOSTINGER-DEPLOYMENT-GUIDE.md`  
**Visual Guide**: This file

**Good luck! 🚀**
