try {
    const hre = require("hardhat");
    console.log("✅ Hardhat loaded successfully");
    console.log("Network:", hre.network.name);
} catch (error) {
    console.error("❌ Failed to load Hardhat:", error);
}
