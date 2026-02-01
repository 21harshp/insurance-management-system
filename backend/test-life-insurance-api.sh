#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5001"
API_ENDPOINT="/api/life-insurance"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Life Insurance API Testing Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Login to get authentication token
echo -e "${YELLOW}Step 1: Logging in to get authentication token...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "SM0002",
    "password": "12345678"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Login failed. Response:${NC}"
    echo $LOGIN_RESPONSE | jq '.' 2>/dev/null || echo $LOGIN_RESPONSE
    exit 1
fi

echo -e "${GREEN}✓ Login successful!${NC}"
echo -e "Token: ${TOKEN:0:20}...\n"

# Step 2: Test GET - Get all life insurance policies (should be empty or show existing)
echo -e "${YELLOW}Step 2: Testing GET ${API_ENDPOINT} - Fetch all policies${NC}"
GET_RESPONSE=$(curl -s -X GET "${BASE_URL}${API_ENDPOINT}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

echo -e "${BLUE}Response:${NC}"
echo $GET_RESPONSE | jq '.' 2>/dev/null || echo $GET_RESPONSE
echo ""

# Step 3: Test POST - Create a new life insurance policy
echo -e "${YELLOW}Step 3: Testing POST ${API_ENDPOINT} - Create new policy${NC}"
CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}${API_ENDPOINT}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "policyHolderName": "Test User API",
    "policyHolderAddress": "123 Test Street, Test City, TC 12345",
    "policyNumber": "LI-TEST-'$(date +%s)'",
    "dateOfCommencement": "2024-01-15",
    "planTermPPT": "100/20/15",
    "premiumAmount": 50000,
    "firstUnpaidPremium": "2024-02-15",
    "paymentMode": "Yearly",
    "sumAssured": 1000000,
    "dateOfLastPremium": "2024-01-15",
    "maturityAmount": 1500000,
    "mobileNumber": "9876543210",
    "dateOfBirth": "1990-05-15",
    "agentCode": "AG12345",
    "nomineeName": "Jane Doe",
    "nomineeRelation": "Spouse",
    "nomineeDOB": "1992-08-20"
  }')

echo -e "${BLUE}Response:${NC}"
echo $CREATE_RESPONSE | jq '.' 2>/dev/null || echo $CREATE_RESPONSE

# Extract the created policy ID
POLICY_ID=$(echo $CREATE_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$POLICY_ID" ]; then
    echo -e "${RED}❌ Failed to create policy or extract policy ID${NC}\n"
else
    echo -e "${GREEN}✓ Policy created successfully!${NC}"
    echo -e "Policy ID: ${POLICY_ID}\n"
fi

# Step 4: Test GET again - Verify the created policy appears
echo -e "${YELLOW}Step 4: Testing GET ${API_ENDPOINT} - Verify created policy${NC}"
GET_AFTER_CREATE=$(curl -s -X GET "${BASE_URL}${API_ENDPOINT}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

echo -e "${BLUE}Response:${NC}"
echo $GET_AFTER_CREATE | jq '.' 2>/dev/null || echo $GET_AFTER_CREATE
echo ""

# Step 5: Test GET with filters - Search by name
echo -e "${YELLOW}Step 5: Testing GET with search filter${NC}"
SEARCH_RESPONSE=$(curl -s -X GET "${BASE_URL}${API_ENDPOINT}?search=Test" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

echo -e "${BLUE}Response:${NC}"
echo $SEARCH_RESPONSE | jq '.' 2>/dev/null || echo $SEARCH_RESPONSE
echo ""

# Step 6: Test DELETE - Delete the created policy
if [ ! -z "$POLICY_ID" ]; then
    echo -e "${YELLOW}Step 6: Testing DELETE ${API_ENDPOINT}/${POLICY_ID}${NC}"
    DELETE_RESPONSE=$(curl -s -X DELETE "${BASE_URL}${API_ENDPOINT}/${POLICY_ID}" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json")
    
    echo -e "${BLUE}Response:${NC}"
    echo $DELETE_RESPONSE | jq '.' 2>/dev/null || echo $DELETE_RESPONSE
    
    if echo $DELETE_RESPONSE | grep -q "deleted successfully"; then
        echo -e "${GREEN}✓ Policy deleted successfully!${NC}\n"
    else
        echo -e "${RED}❌ Failed to delete policy${NC}\n"
    fi
else
    echo -e "${YELLOW}Step 6: Skipping DELETE test (no policy ID available)${NC}\n"
fi

# Step 7: Test GET final - Verify deletion
echo -e "${YELLOW}Step 7: Testing GET ${API_ENDPOINT} - Verify deletion${NC}"
GET_AFTER_DELETE=$(curl -s -X GET "${BASE_URL}${API_ENDPOINT}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

echo -e "${BLUE}Response:${NC}"
echo $GET_AFTER_DELETE | jq '.' 2>/dev/null || echo $GET_AFTER_DELETE
echo ""

# Step 8: Test error cases
echo -e "${YELLOW}Step 8: Testing error cases${NC}"

# Test DELETE with invalid ID
echo -e "${BLUE}8a. Testing DELETE with invalid ID:${NC}"
INVALID_DELETE=$(curl -s -X DELETE "${BASE_URL}${API_ENDPOINT}/invalid123" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")
echo $INVALID_DELETE | jq '.' 2>/dev/null || echo $INVALID_DELETE
echo ""

# Test POST with missing required fields
echo -e "${BLUE}8b. Testing POST with missing required fields:${NC}"
INVALID_CREATE=$(curl -s -X POST "${BASE_URL}${API_ENDPOINT}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "policyHolderName": "Incomplete Policy"
  }')
echo $INVALID_CREATE | jq '.' 2>/dev/null || echo $INVALID_CREATE
echo ""

# Test POST with invalid planTermPPT format
echo -e "${BLUE}8c. Testing POST with invalid planTermPPT format:${NC}"
INVALID_FORMAT=$(curl -s -X POST "${BASE_URL}${API_ENDPOINT}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "policyHolderName": "Test User",
    "policyHolderAddress": "123 Test St",
    "policyNumber": "LI-INVALID",
    "dateOfCommencement": "2024-01-15",
    "planTermPPT": "invalid-format",
    "premiumAmount": 50000,
    "firstUnpaidPremium": "2024-02-15",
    "paymentMode": "Yearly",
    "sumAssured": 1000000,
    "dateOfLastPremium": "2024-01-15",
    "maturityAmount": 1500000,
    "mobileNumber": "9876543210",
    "dateOfBirth": "1990-05-15",
    "agentCode": "AG12345",
    "nomineeName": "Jane Doe",
    "nomineeRelation": "Spouse",
    "nomineeDOB": "1992-08-20"
  }')
echo $INVALID_FORMAT | jq '.' 2>/dev/null || echo $INVALID_FORMAT
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ API Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
