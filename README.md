# 🔗 ChainSight - AI-Powered Supply Chain Intelligence

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Blockchain-Ethereum-627EEA?style=for-the-badge&logo=ethereum" alt="Ethereum">
  <img src="https://img.shields.io/badge/AI/ML-XGBoost-FF6600?style=for-the-badge" alt="ML">
</p>

<p align="center">
  <b>Blockchain-powered, AI-driven supply chain tracker with real-time analytics, delay predictions, and immutable tracking.</b>
</p>

---

## ✨ Features

### 🎯 Core Functionality
- 📦 **Real-time Shipment Tracking** - Track packages from origin to delivery
- 🔗 **Blockchain Integration** - Immutable records on Ethereum/Polygon
- 🤖 **AI Analytics** - ML-powered delay predictions (94%+ accuracy)
- 📊 **Interactive Dashboards** - Beautiful data visualizations
- 🌍 **Global Map** - Animated world map with live routes

### 🎨 Premium UI/UX
- 🌌 **Glassmorphism Design** - Modern frosted glass effects
- ✨ **Smooth Animations** - Page transitions, hover effects, micro-interactions
- 📱 **Fully Responsive** - Works on all devices
- 🌙 **Dark/Light Themes** - Toggle with smooth transitions
- ⌨️ **Command Palette** - Cmd+K style quick navigation

### 🔔 Smart Features
- 🔔 **Real-time Notifications** - Live alerts for shipment updates
- 📈 **Live Statistics** - Animated counters with sparklines
- 🎯 **Quick Actions** - Floating action button for fast access
- 📍 **Activity Feed** - Real-time activity stream
- 🔍 **Global Search** - Find anything instantly

---

## 🖼️ Screenshots

| Home Page | Dashboard |
|-----------|-----------|
| Beautiful landing with video background | Live stats & shipment tracking |

| AI Insights | Global Map |
|-------------|------------|
| ML-powered predictions | Animated shipping routes |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/The-ChandanKV/ChainSight.git
cd ChainSight

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, React Router 7, TailwindCSS 4 |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Blockchain** | Ethers.js, Hardhat, Solidity |
| **AI/ML** | Python, XGBoost, RandomForest, Flask |
| **Charts** | Recharts |
| **State** | Zustand |

---

## 📁 Project Structure

```
ChainSight/
├── app/
│   ├── components/          # React components
│   │   ├── AIInsights.tsx   # AI analytics dashboard
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── GlobalMap.tsx    # World map visualization
│   │   ├── LiveActivityFeed.tsx
│   │   ├── LiveStatsWidget.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── NotificationSystem.tsx
│   │   └── ...
│   ├── routes/              # Page routes
│   ├── store/               # Zustand state
│   └── app.css              # Global styles
├── backend/
│   ├── contracts/           # Smart contracts
│   ├── ml/                  # Python ML service
│   └── src/                 # Backend API
├── vercel.json              # Vercel deployment
├── netlify.toml             # Netlify deployment
└── .github/workflows/       # CI/CD pipelines
```

---

## 🌐 Deployment

Deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/The-ChandanKV/ChainSight)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/The-ChandanKV/ChainSight)

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

---

## 🔧 Configuration

### Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/chainsight

# Blockchain (Optional)
BLOCKCHAIN_ENABLED=false
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
CONTRACT_ADDRESS=0x...
BLOCKCHAIN_PRIVATE_KEY=0x...

# ML Service (Optional)
ML_SERVICE_URL=http://localhost:5000
```

---

## 📊 AI Analytics

ChainSight uses machine learning for intelligent supply chain management:

| Model | Purpose | Accuracy |
|-------|---------|----------|
| **XGBoost Classifier** | Delay Prediction | 94.2% |
| **XGBoost Regressor** | Delay Duration | ±3.2 hrs RMSE |
| **Isolation Forest** | Anomaly Detection | 89% |

### Running the ML Service

```bash
cd backend/ml
pip install -r requirements.txt
python train_model.py
python ml_service.py
```

---

## 🔗 Blockchain Integration

Immutable shipment tracking on Ethereum/Polygon:

- ✅ Create shipment records on-chain
- ✅ Track status updates immutably
- ✅ Verify data integrity
- ✅ Complete audit trail

### Deploying Smart Contract

```bash
cd backend
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- React Router team for the amazing framework
- TailwindCSS for beautiful styling
- Recharts for data visualization
- The open-source community

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/The-ChandanKV">Chandan KV</a>
</p>

<p align="center">
  <b>⭐ Star this repo if you find it useful!</b>
</p>
