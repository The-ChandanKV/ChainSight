# ChainSight - Blockchain Supply Chain Tracker

## 🚀 On-Chain Shipment Tracking Implementation

This project implements **on-chain shipment tracking** using Ethereum testnets (Sepolia) or Polygon (Amoy). Every shipment creation and status update is recorded as a blockchain transaction with cryptographic hashing for data integrity.

---

## 📋 Features Implemented

### ✅ Smart Contract (`SupplyChain.sol`)
- **Shipment Creation**: Records shipmentId, origin, destination, carrier, timestamp, and creator address
- **Data Hashing**: Generates keccak256 hash of shipment data for integrity verification
- **Status Updates**: Each update creates a new on-chain transaction with location and notes
- **History Tracking**: Complete audit trail of all status changes
- **Data Verification**: Built-in function to verify data hasn't been tampered with

### ✅ Blockchain Integration (`blockchain.js`)
- **Multi-Network Support**: Ethereum Sepolia, Polygon Amoy/Mumbai
- **Comprehensive Error Handling**: Detailed logging and error messages
- **Event Listening**: Real-time monitoring of blockchain events
- **Gas Tracking**: Returns gas used for each transaction

### ✅ REST API (`server.js`)
- `POST /api/shipment/create` - Create new shipment on-chain
- `PUT /api/shipment/update/:id` - Update shipment status
- `GET /api/shipment/:id` - Get shipment details
- `GET /api/shipment/:id/history` - Get full history
- `GET /api/shipment/:id/verify` - Verify data integrity
- `GET /api/shipments` - List all shipments
- `GET /api/network` - Get blockchain network info
- `GET /api/health` - Health check with blockchain status

---

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install --legacy-peer-deps
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
# Choose your network (Sepolia recommended for testing)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
# OR
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology/

# Your wallet private key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Will be filled after deployment
CONTRACT_ADDRESS=

# Optional MongoDB for caching
MONGODB_URI=mongodb://localhost:27017/chainsight

# Server port
PORT=3001
```

### 3. Get Testnet Tokens

**For Ethereum Sepolia:**
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Enter your wallet address
- Receive free testnet ETH

**For Polygon Amoy:**
- Visit [Polygon Faucet](https://faucet.polygon.technology/)
- Select Amoy testnet
- Receive free testnet MATIC

### 4. Compile Smart Contract

```bash
npx hardhat compile
```

### 5. Deploy to Testnet

**Deploy to Sepolia:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Deploy to Polygon Amoy:**
```bash
npx hardhat run scripts/deploy.js --network polygonAmoy
```

**Deploy to Local Hardhat Network (for testing):**
```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Update .env with Contract Address

After deployment, copy the contract address and add to `.env`:
```
CONTRACT_ADDRESS=0x...
```

### 7. Start Backend Server

```bash
node src/server.js
```

---

## 📝 Usage Examples

### Create a Shipment (via API)

```bash
curl -X POST http://localhost:3001/api/shipment/create \
  -H "Content-Type: application/json" \
  -d '{
    "shipmentId": "SHIP-001",
    "origin": "New York, USA",
    "destination": "London, UK",
    "carrier": "DHL Express"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Shipment created and recorded on blockchain",
  "data": {
    "shipmentId": "SHIP-001",
    "origin": "New York, USA",
    "destination": "London, UK",
    "carrier": "DHL Express",
    "transactionHash": "0x...",
    "blockNumber": 12345,
    "dataHash": "0x...",
    "gasUsed": "150000"
  }
}
```

### Update Shipment Status

```bash
curl -X PUT http://localhost:3001/api/shipment/update/SHIP-001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Transit",
    "location": "Atlantic Ocean",
    "notes": "On schedule, weather clear"
  }'
```

### Get Shipment History

```bash
curl http://localhost:3001/api/shipment/SHIP-001/history
```

**Response:**
```json
{
  "success": true,
  "shipmentId": "SHIP-001",
  "history": [
    {
      "status": "Created",
      "timestamp": 1732865400,
      "updatedBy": "0x...",
      "location": "New York, USA",
      "notes": "Shipment created"
    },
    {
      "status": "In Transit",
      "timestamp": 1732869000,
      "updatedBy": "0x...",
      "location": "Atlantic Ocean",
      "notes": "On schedule, weather clear"
    }
  ],
  "count": 2
}
```

### Verify Data Integrity

```bash
curl http://localhost:3001/api/shipment/SHIP-001/verify
```

**Response:**
```json
{
  "success": true,
  "shipmentId": "SHIP-001",
  "verified": true,
  "message": "Shipment data is valid and untampered"
}
```

---

## 🧪 Testing with Hardhat Scripts

### Interactive Testing

```bash
npx hardhat run scripts/interact.js --network sepolia
```

This script will:
1. Create a test shipment
2. Fetch and display shipment details
3. Update the status
4. Show complete history
5. Verify data integrity

---

## 🔍 How On-Chain Tracking Works

### 1. **Shipment Creation**
When you create a shipment:
- Data is hashed using keccak256 (SHA-3)
- Hash includes: shipmentId, origin, destination, carrier, timestamp, creator address
- Transaction is sent to blockchain
- Event `ShipmentCreated` is emitted with indexed parameters
- Transaction hash and block number are returned

### 2. **Status Updates**
Every status update:
- Creates a new blockchain transaction
- Records: status, location, notes, timestamp, updater address
- Appends to immutable history array
- Emits `ShipmentUpdated` event
- Cannot be deleted or modified (blockchain immutability)

### 3. **Data Integrity**
- Original data hash is stored on-chain
- `verifyShipmentHash()` recomputes hash from stored data
- Compares with original hash
- Any tampering would change the hash → verification fails

### 4. **Transparency & Auditability**
- All transactions are public on blockchain explorers
- Anyone can verify the data
- Complete audit trail from creation to delivery
- Timestamps are blockchain-verified (cannot be faked)

---

## 🌐 Network Configuration

### Supported Networks

| Network | Chain ID | RPC URL | Faucet | Explorer |
|---------|----------|---------|--------|----------|
| Ethereum Sepolia | 11155111 | https://sepolia.infura.io/v3/YOUR_KEY | [sepoliafaucet.com](https://sepoliafaucet.com/) | [sepolia.etherscan.io](https://sepolia.etherscan.io/) |
| Polygon Amoy | 80002 | https://rpc-amoy.polygon.technology/ | [faucet.polygon.technology](https://faucet.polygon.technology/) | [amoy.polygonscan.com](https://amoy.polygonscan.com/) |
| Hardhat Local | 31337 | http://127.0.0.1:8545 | N/A | N/A |

---

## 📊 Gas Costs (Approximate)

| Operation | Sepolia (ETH) | Polygon Amoy (MATIC) |
|-----------|---------------|----------------------|
| Deploy Contract | ~0.005 ETH | ~0.001 MATIC |
| Create Shipment | ~0.0015 ETH | ~0.0003 MATIC |
| Update Status | ~0.001 ETH | ~0.0002 MATIC |

*Note: Costs vary based on network congestion*

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use testnet for development** - Never use mainnet private keys in development
3. **Validate all inputs** - API validates required fields
4. **Use environment variables** - Keep sensitive data out of code
5. **Monitor gas prices** - Set reasonable gas limits

---

## 🐛 Troubleshooting

### Contract not initialized
**Error:** `Contract not initialized. Please set CONTRACT_ADDRESS...`

**Solution:**
1. Make sure you deployed the contract
2. Copy the contract address from deployment output
3. Add to `.env`: `CONTRACT_ADDRESS=0x...`
4. Restart the server

### Insufficient funds
**Error:** `insufficient funds for gas * price + value`

**Solution:**
- Get testnet tokens from faucets (see links above)
- Check your wallet balance

### Network connection issues
**Error:** `Failed to fetch...`

**Solution:**
1. Check your RPC URL is correct
2. Verify internet connection
3. Try alternative RPC providers (Alchemy, QuickNode)

---

## 📚 API Reference

### Create Shipment
```
POST /api/shipment/create
Content-Type: application/json

Body:
{
  "shipmentId": "string (required)",
  "origin": "string (required)",
  "destination": "string (required)",
  "carrier": "string (required)"
}
```

### Update Shipment
```
PUT /api/shipment/update/:id
Content-Type: application/json

Body:
{
  "status": "string (required)",
  "location": "string (optional)",
  "notes": "string (optional)"
}
```

### Get Shipment
```
GET /api/shipment/:id
```

### Get History
```
GET /api/shipment/:id/history
```

### Verify Integrity
```
GET /api/shipment/:id/verify
```

### List All Shipments
```
GET /api/shipments
```

### Network Info
```
GET /api/network
```

---

## 🎯 Next Steps

1. **Frontend Integration**: Build a React/Vue frontend to interact with the API
2. **QR Code Generation**: Generate QR codes for shipment tracking
3. **Email Notifications**: Send updates when status changes
4. **IoT Integration**: Connect with IoT devices for automatic updates
5. **Analytics Dashboard**: Visualize shipment data and trends

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review Hardhat documentation: https://hardhat.org/
- Ethereum documentation: https://ethereum.org/developers

---

**Built with ❤️ using Ethereum, Hardhat, and Express.js**
