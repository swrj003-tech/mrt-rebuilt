#!/bin/bash

# ============================================
# MRT International - Post-Deployment Testing Script
# Run this on Hostinger server after deployment
# ============================================

echo "🧪 MRT International - Post-Deployment Testing"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="${1:-localhost:3001}"
API_URL="http://$DOMAIN"

if [[ $DOMAIN != localhost* ]]; then
    API_URL="https://$DOMAIN"
fi

echo "Testing domain: $DOMAIN"
echo "API URL: $API_URL"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Testing: $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $response)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} (HTTP $response, expected $expected_status)"
        ((TESTS_FAILED++))
    fi
}

# Function to test JSON response
test_json_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing: $description... "
    
    response=$(curl -s "$API_URL$endpoint" 2>/dev/null)
    
    if echo "$response" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✓${NC} (Valid JSON)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} (Invalid JSON or no response)"
        ((TESTS_FAILED++))
    fi
}

echo "🔍 Testing Backend API..."
echo "------------------------"

# Health check
test_endpoint "/health" "Health check endpoint"

# API endpoints
test_json_endpoint "/api/categories" "Categories API"
test_json_endpoint "/api/products" "Products API"
test_json_endpoint "/api/testimonials" "Testimonials API"
test_json_endpoint "/api/legacy/products" "Legacy products API"
test_json_endpoint "/api/legacy/themes" "Legacy themes API"

echo ""
echo "🌐 Testing Frontend..."
echo "----------------------"

# Frontend pages
test_endpoint "/" "Homepage"
test_endpoint "/categories.html" "Categories page"
test_endpoint "/about.html" "About page"
test_endpoint "/contact.html" "Contact page"

echo ""
echo "🔐 Testing Admin Panel..."
echo "-------------------------"

test_endpoint "/admin" "Admin panel" "200"

echo ""
echo "📊 Testing Database Connection..."
echo "----------------------------------"

# Test if products have categories
echo -n "Checking product-category relationships... "
products_response=$(curl -s "$API_URL/api/products" 2>/dev/null)

if echo "$products_response" | jq -e '.[0].categoryId' > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} (Products linked to categories)"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠${NC} (No products found or missing category links)"
    ((TESTS_FAILED++))
fi

echo ""
echo "🔧 Testing Server Process..."
echo "----------------------------"

# Check if PM2 is running (if on server)
if command -v pm2 &> /dev/null; then
    echo -n "Checking PM2 process... "
    if pm2 list | grep -q "mrt-international"; then
        echo -e "${GREEN}✓${NC} (PM2 process running)"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} (PM2 process not found)"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠${NC} PM2 not installed (skip if testing locally)"
fi

echo ""
echo "================================================"
echo "📊 Test Summary"
echo "================================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Deployment successful.${NC}"
    echo ""
    echo "🎉 Your MRT International platform is live!"
    echo ""
    echo "Access points:"
    echo "- Frontend: $API_URL"
    echo "- Admin Panel: $API_URL/admin"
    echo "- API Health: $API_URL/health"
    echo ""
    echo "Next steps:"
    echo "1. Login to admin panel"
    echo "2. Add/verify categories"
    echo "3. Add/verify products"
    echo "4. Test affiliate links"
    echo "5. Monitor PM2 logs: pm2 logs mrt-international"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Please investigate.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check PM2 logs: pm2 logs mrt-international"
    echo "2. Verify .env configuration"
    echo "3. Check database connection"
    echo "4. Verify Nginx/Apache configuration"
    echo "5. Check file permissions"
    exit 1
fi
