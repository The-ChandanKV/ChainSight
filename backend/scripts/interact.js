const hre = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
        console.error("❌ Please set CONTRACT_ADDRESS in .env");
        return;
    }

    console.log(`🔗 Connecting to contract at ${contractAddress}...`);
    const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
    const supplyChain = SupplyChain.attach(contractAddress);

    // 1. Create a shipment with detailed info
    const shipmentId = "SHIP-" + Date.now();
    const origin = "New York, USA";
    const destination = "London, UK";
    const carrier = "Global Logistics Inc.";

    console.log(`\n📦 Creating shipment: ${shipmentId}`);
    console.log(`   Origin: ${origin}`);
    console.log(`   Destination: ${destination}`);
    console.log(`   Carrier: ${carrier}`);

    const createTx = await supplyChain.createShipment(shipmentId, origin, destination, carrier);
    console.log(`⏳ Transaction sent: ${createTx.hash}`);
    await createTx.wait();
    console.log("✅ Shipment created successfully!");

    // 2. Fetch it back to verify
    const shipment = await supplyChain.getShipment(shipmentId);
    console.log("\n🔍 Fetched Shipment Details:");
    console.log(`   Status: ${shipment.status}`);
    console.log(`   Data Hash: ${shipment.dataHash}`);

    // 3. Update status
    const newStatus = "In Transit";
    const location = "Atlantic Ocean";
    const notes = "On schedule, weather clear";

    console.log(`\n📝 Updating status to: '${newStatus}'`);
    console.log(`   Location: ${location}`);

    const updateTx = await supplyChain.updateShipmentStatus(shipmentId, newStatus, location, notes);
    await updateTx.wait();
    console.log("✅ Status updated successfully!");

    // 4. Verify History
    console.log("\n📜 Fetching History:");
    const history = await supplyChain.getShipmentHistory(shipmentId);
    history.forEach((record, index) => {
        console.log(`   [${index}] Status: ${record.status}, Location: ${record.location}, Notes: ${record.notes}`);
    });

    // 5. Verify Data Integrity
    console.log("\n🔐 Verifying Data Integrity...");
    const isValid = await supplyChain.verifyShipmentHash(shipmentId);
    console.log(`   Data Integrity Check: ${isValid ? "✅ VALID" : "❌ INVALID"}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
