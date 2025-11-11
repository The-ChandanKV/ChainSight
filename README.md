# ChainSight - Supply Chain Management System

A modern, production-ready template for building full-stack React applications using React Router with MongoDB backend for shipment tracking.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 🗄️ MongoDB integration for data persistence
- 📡 RESTful API for shipment management
- ⛓️ **Blockchain integration for tamper-proof tracking**
- 🔐 **Ethereum/Polygon support for immutable audit trails**
- 📝 **Smart contract for shipment verification**
- 📖 [React Router docs](https://reactrouter.com/)

## API Routes

The application provides the following REST API endpoints:

- `GET /api/shipments` - Fetch all shipments
- `POST /api/shipments` - Create a new shipment
- `PUT /api/shipments/:id/status` - Update shipment status

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

Install the dependencies:

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chainsight

# Blockchain Configuration (Optional)
BLOCKCHAIN_ENABLED=false
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=
BLOCKCHAIN_PRIVATE_KEY=
```

Or for MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chainsight?retryWrites=true&w=majority
```

**Note**: Blockchain integration is optional. Set `BLOCKCHAIN_ENABLED=true` only after deploying the smart contract. See [Blockchain Setup](#blockchain-integration) below.

### MongoDB Setup

**Local MongoDB:**
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Windows
   net start MongoDB

   # On Linux
   sudo systemctl start mongod
   ```

**MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and database
3. Get connection string and add to `.env`

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

## Blockchain Integration

### Overview

ChainSight includes blockchain integration to make your supply chain **tamper-proof and traceable**. Every shipment creation and status update is recorded on-chain.

### Features

- ✅ **Immutable Records**: All shipment data is hashed and stored on blockchain
- ✅ **Audit Trail**: Complete history of all status changes
- ✅ **Verification**: Verify any shipment data against blockchain records
- ✅ **Transparency**: Public blockchain provides transparency
- ✅ **Gas Optimized**: Only stores hashes to minimize costs

### Quick Start

1. **Deploy Smart Contract**:
   ```bash
   # Use Remix IDE (https://remix.ethereum.org/)
   # Copy ShipmentTracker.sol from root directory
   # Deploy to Sepolia testnet
   # Copy contract address
   ```

2. **Get Testnet Funds**:
   - Visit https://sepoliafaucet.com/
   - Get free Sepolia ETH for testing

3. **Configure Environment**:
   ```env
   BLOCKCHAIN_ENABLED=true
   BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
   BLOCKCHAIN_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
   ```

4. **Test Integration**:
   ```bash
   npm run dev
   # Create a shipment - check console for blockchain tx
   # Update status - verify on https://sepolia.etherscan.io/
   ```

### Smart Contract

The `ShipmentTracker.sol` contract provides:

```solidity
// Record shipment creation
function createShipment(string shipmentId, string status)

// Record status updates
function updateShipmentStatus(string shipmentId, string status)

// Get shipment history
function getShipmentHistory(string shipmentId) returns (bytes32[])

// Verify shipment data
function verifyShipmentData(string shipmentId, bytes32 dataHash) returns (bool)
```

### Supported Networks

- **Ethereum Sepolia** (Testnet) - Recommended for development
- **Polygon Mumbai** (Testnet) - Faster and cheaper
- **Ethereum Mainnet** (Production) - Most secure
- **Polygon Mainnet** (Production) - Cost-effective
- **Hyperledger Fabric** (Private) - Enterprise use cases

### How It Works

```
Shipment Creation:
  User creates shipment → API records on blockchain → Saves to MongoDB with tx hash

Status Update:
  User updates status → API records on blockchain → Updates MongoDB with new tx hash

Verification:
  Anyone can verify shipment data by checking blockchain transaction history
```

### Cost Estimation

**Testnet (Free)**:
- Deployment: Free (testnet ETH)
- Per transaction: Free

**Mainnet (Production)**:
- Ethereum: ~$2-5 per transaction
- Polygon: ~$0.001 per transaction (recommended)

### Security Notes

⚠️ **Important**:
- Never commit `.env` file to git
- Use separate wallets for development/production
- Keep private keys secure
- Only hashes are stored on-chain (GDPR compliant)

### Resources

- [Detailed Setup Guide](./BLOCKCHAIN_SETUP.md) (coming soon)
- [Smart Contract Source](./ShipmentTracker.sol)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Sepolia Explorer](https://sepolia.etherscan.io/)

---

Built with ❤️ using React Router and Ethereum.
