<div align="center">
  <br />
  <h1 align="center">🌟 LuminATE 🌟</h1>
  <p align="center">
    <b>Where Your Content is Truly Yours.</b>
    <br />
    A decentralized content platform on the Stellar network, empowering creators with on-chain ownership and an AI-driven economy.
  </p>
 <img width="1488" alt="Screenshot 2025-06-22 at 10 36 49" src="https://github.com/user-attachments/assets/5d8918bd-c674-4401-b804-1f14692afd78" />

![Luminate](https://github.com/user-attachments/assets/976effb9-1b1e-4929-bb0a-e3f1793c3281)
</div>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img alt="Stellar" src="https://img.shields.io/badge/Stellar-000000?style=for-the-badge&logo=stellar&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white">
</p>

---

## 🚀 The Mission

LuminATE is a decentralized publishing platform built on Stellar, designed to onboard and activate Web3 users through gamified content creation.Add commentMore actions

Users generate their first content by completing a short quiz ("Secret"), which produces a personalized post using AI. The platform assigns engagement-based scores (ATEs) to track activity like reading, sharing, and publishing.

LuminATE replaces complex publishing flows with a fast onboarding system, and offers projects a scalable way to engage users through native, user-generated content.

## ✨ Core Features

-   🌐 **Decentralized & On-Chain:** All content metadata is stored on the Stellar blockchain via Soroban smart contracts. The content itself is pinned to IPFS, ensuring it's censorship-resistant and permanent.
-   🖼️ **Content as Collectible NFTs:** Creators can mint their posts as collectible NFTs on the Stellar network. This empowers them with true ownership and opens up new, direct monetization channels with their community.
-   💸 **On-Chain Economy & Scoring:** LuminATE introduces a transparent, on-chain scoring system to reward user contributions. Every interaction has value:
    -   **Publishing a post:** `+2 LUMIN`
    -   **Sharing content:** `+5 LUMIN`
    -   **Referring a new user:** `+10 LUMIN`
    -   **Reading content:** `+0.1 LUMIN`
-   🤖 **AI-Powered Secrets:** Use the integrated **Groq** AI to generate unique, unlockable "secret" content for your posts, adding an element of surprise and value for your audience.
-   🔐 **End-to-End Type-Safety:** Built with a modern, robust stack including tRPC, Drizzle ORM, and TypeScript for a highly maintainable and error-free codebase.
-   🔑 **Secure Authentication:** User accounts are managed through Lucia, providing a secure and reliable authentication system.

## 🏗️ Architecture

Here's a look at how the different components of LuminATE work together:

## 🛠️ Tech Stack

<img width="1116" alt="Screenshot 2025-06-22 at 13 05 53" src="https://github.com/user-attachments/assets/1cf1f560-3914-4cc1-8919-d5ebafd5e6ef" />

-   **Framework:** Next.js (App Router)
-   **Blockchain:** Stellar (Soroban)
-   **Decentralized Storage:** IPFS (via Pinata)
-   **Database:** PostgreSQL
-   **ORM:** Drizzle ORM
-   **API:** tRPC
-   **Authentication:** Lucia
-   **Styling:** TailwindCSS
-   **UI Components:** Shadcn/UI
-   **AI:** Groq
-   **Deployment:** Vercel

## ⚙️ Getting Started

Follow these steps to get a local instance of LuminATE up and running.

### Prerequisites

-   Node.js 20+
-   PNPM (`npm install -g pnpm`)
-   Docker
-   [Freighter Wallet](https://www.freighter.app/) Browser Extension
-   [Rust Toolchain](https://www.rust-lang.org/tools/install) (for smart contract development)

### 1. Clone & Install

```bash
git clone <repository-url>
cd luminate
pnpm install
```

### 2. Set Up Environment

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Now, fill in the necessary variables in your new `.env` file:

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

### 3. Start Services & Run

```bash
# Start the PostgreSQL database in Docker
docker-compose up -d

# Apply database migrations
pnpm db:push

# Start the development server
pnpm dev
```

Your application should now be live at `http://localhost:3000`!

## ⛓️ Smart Contract Development

The Soroban smart contracts are the backbone of LuminATE, located in the `/contracts` directory.

### Build & Test

We've included a convenient script to streamline the development process.

1.  **Navigate to the contracts directory:** `cd contracts`
2.  **Make the script executable:** `chmod +x scripts/test-runner.sh`
3.  **Run the script:** `./scripts/test-runner.sh`

This will run all contract tests and build the `.wasm` file for deployment. The compiled contract can be found at `target/wasm32-unknown-unknown/release/post_contract.wasm`.

## 🗺️ Roadmap

We have big plans for LuminATE! Here's what we're working on next:

-   [ ] **Notification System:** Real-time alerts for interactions.
-   [ ] **Bookmarks:** Save your favorite content for later.
-   [ ] **Enhanced Mobile Responsiveness:** A flawless experience on any device.
-   [ ] **Advanced Analytics:** In-depth insights for creators.

## 🤝 Contributing

We welcome contributions from the community! If you'd like to help improve LuminATE, please feel free to fork the repository, make your changes, and submit a pull request.

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---
<p align="center">
  Built with ❤️ for the future of decentralized content.
</p>
