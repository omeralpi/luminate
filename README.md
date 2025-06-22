# LuminATE

LuminATE is a decentralized content publishing platform that combines the power of a modern web stack with the security and transparency of the Stellar blockchain.

<img width="1488" alt="Screenshot 2025-06-22 at 10 36 49" src="https://github.com/user-attachments/assets/5d8918bd-c674-4401-b804-1f14692afd78" />

![Luminate](https://github.com/user-attachments/assets/976effb9-1b1e-4929-bb0a-e3f1793c3281)

## 🏆 Why This Project?

LuminATE is a decentralized publishing platform built on Stellar, designed to onboard and activate Web3 users through gamified content creation.

Users generate their first content by completing a short quiz ("Secret"), which produces a personalized post using AI. The platform assigns engagement-based scores (ATEs) to track activity like reading, sharing, and publishing.

LuminATE replaces complex publishing flows with a fast onboarding system, and offers projects a scalable way to engage users through native, user-generated content.

## ⚙️ Tech Stack
- 🔹 **Next.js** ⚡ (Frontend & Backend Framework)
- 🔹 **Stellar (Soroban)** ⛓️ (Blockchain for Smart Contracts & NFTs)
- 🔹 **Pinata (IPFS)** 🧊 (Decentralized Content Storage)
- 🔹 **PostgreSQL** 🗄️ (Database)
- 🔹 **Drizzle ORM** 🎯 (TypeScript ORM)
- 🔹 **tRPC** 📞 (End-to-end Typesafe APIs)
- 🔹 **Lucia** 🔑 (Authentication)
- 🔹 **TailwindCSS** 🎨 (Styling)
- 🔹 **Shadcn/UI** 🧩 (UI Components)
- 🔹 **Groq** 🧠 (Fast AI Inference)
- 🔹 **Vercel** 🚀 (Hosting & OG Image Generation)

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   PNPM package manager
*   Docker (for local PostgreSQL instance)
*   [Freighter Wallet](https://www.freighter.app/) browser extension (for interacting with Stellar)
*   [Rust](https://www.rust-lang.org/tools/install) toolchain (including `cargo`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd luminate
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following variables.
    ```env
    # PostgreSQL connection URL
    DATABASE_URL="postgresql://user:password@localhost:5432/db_name"

    # Stellar Network Configuration
    NEXT_PUBLIC_STELLAR_NETWORK="testnet"
    NEXT_PUBLIC_STELLAR_RPC_URL="https://soroban-testnet.stellar.org"
    # Find the contract ID after deploying your Soroban contract
    NEXT_PUBLIC_STELLAR_CONTRACT_ID="<YOUR_CONTRACT_ID>"

    # GROQ AI Configuration
    GROQ_API_KEY="<YOUR_GROQ_API_KEY>"

    # Application URL
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

3.  **Start the database:**
    ```bash
    docker-compose up -d
    ```

4.  **Install dependencies:**
    ```bash
    pnpm install
    ```

5.  **Run database migrations:**
    ```bash
    pnpm db:push
    ```

6.  **Start the development server:**
    ```bash
    pnpm dev
    ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

### Smart Contracts (Soroban)

The Soroban smart contracts for LuminATE are located in the `contracts` directory.

#### Running Tests & Building

A script is provided to simplify testing and building the contract.

1.  **Navigate to the contracts directory:**
    ```bash
    cd contracts
    ```

2.  **Make the test runner executable (if you haven't already):**
    ```bash
    chmod +x scripts/test-runner.sh
    ```

3.  **Run the script:**
    ```bash
    ./scripts/test-runner.sh
    ```

This script will run all contract tests and then build the WASM file for deployment.

#### Manual Commands

You can also run tests or build the contract manually using `cargo` from within the `contracts` directory.

*   **Run all tests:**
    ```bash
    cargo test
    ```

*   **Build the contract:**
    ```bash
    cargo build --target wasm32-unknown-unknown --release
    ```

The compiled contract will be located at `target/wasm32-unknown-unknown/release/post_contract.wasm`.

#### Available Tests

The contract includes a comprehensive test suite to ensure its functionality and security. Here are some of the key tests:

*   `test_initialize`: Checks if the contract initializes correctly.
*   `test_user_creates_post`: Verifies that a user can create a new post.
*   `test_author_cannot_uncollect_own_post`: Ensures an author cannot uncollect their own post.
*   `test_cannot_collect_twice`: Prevents a user from collecting the same post more than once.
*   `test_uncollect_functionality`: Tests the uncollecting functionality.
*   `test_max_supply_limit`: Checks the maximum supply limit for collectibles.
*   `test_nft_conversion_optional`: Verifies the optional NFT conversion logic.
*   `test_unlimited_collecting`: Tests the functionality for posts with unlimited collects.
*   `test_get_total_posts`: Ensures the total post count is accurate.
*   `test_multiple_posts_and_collections`: Tests scenarios with multiple posts and collections.

### 📋 TODO List
*   [x] Content categories & tags
*   [x] On-chain content verification
*   [x] AI-powered secret generation
*   [ ] Notification system
*   [ ] Bookmarks system
*   [ ] Subscribe user
*   [ ] More more responsive

📜 License
This project is licensed under the MIT License.
