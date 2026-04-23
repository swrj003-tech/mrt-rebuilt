#!/bin/bash
echo "--- MRT INTERNATIONAL HOSTINGER DEPLOYER ---"

# 1. Update Code
echo "[1/4] Pulling latest code..."
git pull origin main

# 2. Update Dependencies (Safe mode)
echo "[2/4] Verifying dependencies..."
npm install --production

# 3. Force Frontend Rebuild
echo "[3/4] Rebuilding frontend (Purging ghost data)..."
npm run build

# 4. Restart Backend
echo "[4/4] Triggering backend restart..."
touch app.js

echo "--- DEPLOYMENT COMPLETE ---"
echo "Visit https://mrtinternationalholding.com/api/test-db to verify connection."
