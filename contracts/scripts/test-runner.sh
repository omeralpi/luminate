#!/bin/bash

echo "🚀 LuminATE Publishing Contract Test Runner"
echo "===================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' 

if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Cargo is not installed. Please install Rust first.${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Running all tests...${NC}"
if cargo test; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Running tests with detailed output...${NC}"
cargo test -- --nocapture --test-threads=1

echo -e "\n${YELLOW}Test Summary:${NC}"
cargo test 2>&1 | grep -E "test result:|running"

echo -e "\n${YELLOW}Running specific test scenarios:${NC}"

echo -e "\n1️⃣  Testing user post creation..."
cargo test test_user_creates_post -- --nocapture

echo -e "\n2️⃣  Testing NFT functionality..."
cargo test test_nft_conversion_optional -- --nocapture

echo -e "\n3️⃣  Testing unlimited collecting..."
cargo test test_unlimited_collecting -- --nocapture

echo -e "\n${GREEN}✨ Test run completed!${NC}"

echo -e "\n${YELLOW}Building the contract...${NC}"
if cargo build --target wasm32-unknown-unknown --release; then
    echo -e "${GREEN}✅ Contract built successfully!${NC}"
    
    if [ -f "target/wasm32-unknown-unknown/release/post_contract.wasm" ]; then
        SIZE=$(ls -lh target/wasm32-unknown-unknown/release/post_contract.wasm | awk '{print $5}')
        echo -e "📦 WASM file size: ${SIZE}"
    fi
else
    echo -e "${RED}❌ Contract build failed!${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 All done!${NC}"