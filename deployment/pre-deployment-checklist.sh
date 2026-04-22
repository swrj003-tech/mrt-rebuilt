#!/bin/bash

# ============================================
# MRT International - Pre-Deployment Verification Script
# Run this before deploying to Hostinger
# ============================================

echo "🔍 MRT International - Pre-Deployment Checklist"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check and report
check_item() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((CHECKS_FAILED++))
    fi
}

# 1. Check if package.json exists
echo "📦 Checking Project Files..."
[ -f "package.json" ]
check_item $? "package.json exists"

[ -f "package-lock.json" ]
check_item $? "package-lock.json exists"

[ -f "ecosystem.config.js" ]
check_item $? "ecosystem.config.js exists"

[ -f ".env.production.example" ]
check_item $? ".env.production.example exists"

echo ""

# 2. Check if required directories exist
echo "📁 Checking Directory Structure..."
[ -d "server" ]
check_item $? "server/ directory exists"

[ -d "prisma" ]
check_item $? "prisma/ directory exists"

[ -d "admin" ]
check_item $? "admin/ directory exists"

[ -d "public" ]
check_item $? "public/ directory exists"

echo ""

# 3. Check if Prisma schema exists
echo "🗄️  Checking Database Configuration..."
[ -f "prisma/schema.prisma" ]
check_item $? "Prisma schema exists"

[ -f "deployment/mysql-schema.sql" ]
check_item $? "MySQL schema exists"

[ -f "deployment/seed-categories-products.sql" ]
check_item $? "Seed data SQL exists"

echo ""

# 4. Check if Node.js is installed
echo "🔧 Checking System Requirements..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗${NC} Node.js not installed"
    ((CHECKS_FAILED++))
fi

# 5. Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗${NC} npm not installed"
    ((CHECKS_FAILED++))
fi

echo ""

# 6. Check if dependencies are installed
echo "📚 Checking Dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠${NC} node_modules not found - run 'npm install'"
    ((CHECKS_FAILED++))
fi

echo ""

# 7. Check if build directory exists
echo "🏗️  Checking Build Status..."
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} dist/ directory exists"
    ((CHECKS_PASSED++))
    
    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✓${NC} dist/index.html exists"
        ((CHECKS_PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} dist/index.html not found - run 'npm run build'"
        ((CHECKS_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠${NC} dist/ not found - run 'npm run build'"
    ((CHECKS_FAILED++))
fi

echo ""

# 8. Check server files
echo "🖥️  Checking Server Files..."
[ -f "server/index.js" ]
check_item $? "server/index.js exists"

[ -f "server/db.js" ]
check_item $? "server/db.js exists"

[ -d "server/routes" ]
check_item $? "server/routes/ directory exists"

echo ""

# 9. Check deployment files
echo "🚀 Checking Deployment Files..."
[ -f "deployment/HOSTINGER-DEPLOYMENT-GUIDE.md" ]
check_item $? "Deployment guide exists"

[ -f "deployment/mysql-schema.sql" ]
check_item $? "MySQL schema exists"

[ -f "deployment/seed-categories-products.sql" ]
check_item $? "Seed data exists"

echo ""

# 10. Summary
echo "================================================"
echo "📊 Summary"
echo "================================================"
echo -e "Checks Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Checks Failed: ${RED}$CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review deployment/HOSTINGER-DEPLOYMENT-GUIDE.md"
    echo "2. Prepare your Hostinger database credentials"
    echo "3. Upload files to Hostinger"
    echo "4. Import MySQL schema"
    echo "5. Configure .env file"
    echo "6. Start the application with PM2"
    exit 0
else
    echo -e "${YELLOW}⚠ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "- Run 'npm install' to install dependencies"
    echo "- Run 'npm run build' to create production build"
    echo "- Ensure all required files are present"
    exit 1
fi
