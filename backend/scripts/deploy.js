const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Deploying SupplyChain contract...\n");

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer address: ${deployer.address}`);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  // Deploy contract
  console.log("⏳ Deploying contract...");
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();

  const address = await supplyChain.getAddress();

  console.log("\n✅ SupplyChain contract deployed successfully!");
  console.log(`📍 Contract address: ${address}`);
  console.log(`🔗 Block explorer: ${getExplorerUrl(network.chainId, address)}\n`);

  // Save deployment info
  console.log("📝 Next steps:");
  console.log(`   1. Copy the contract address above`);
  console.log(`   2. Add it to your .env file: CONTRACT_ADDRESS=${address}`);
  console.log(`   3. Verify the contract (optional):`);
  console.log(`      npx hardhat verify --network ${hre.network.name} ${address}`);
  console.log(`   4. Start your backend server: npm start\n`);
}

function getExplorerUrl(chainId, address) {
  const explorers = {
    1: `https://etherscan.io/address/${address}`,
    11155111: `https://sepolia.etherscan.io/address/${address}`, // Sepolia
    80001: `https://mumbai.polygonscan.com/address/${address}`, // Mumbai
    80002: `https://amoy.polygonscan.com/address/${address}`, // Amoy
    137: `https://polygonscan.com/address/${address}`, // Polygon Mainnet
  };
  return explorers[chainId] || `Chain ID ${chainId} - Explorer URL not configured`;
}

main().catch((error) => {
  console.error("\n❌ Deployment failed:");
  console.error(error);
  process.exitCode = 1;
});
