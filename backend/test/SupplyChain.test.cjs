const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
    let SupplyChain;
    let supplyChain;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        SupplyChain = await ethers.getContractFactory("SupplyChain");
        supplyChain = await SupplyChain.deploy();
        await supplyChain.waitForDeployment();
    });

    it("Should create a shipment with detailed info and emit event", async function () {
        const shipmentId = "SHIP-001";
        const origin = "New York";
        const destination = "London";
        const carrier = "DHL";

        const tx = await supplyChain.createShipment(shipmentId, origin, destination, carrier);
        const receipt = await tx.wait();

        // Check for event
        const event = receipt.logs.find(log => {
            try {
                return supplyChain.interface.parseLog(log).name === "ShipmentCreated";
            } catch (e) { return false; }
        });

        expect(event).to.not.be.undefined;
        const parsedLog = supplyChain.interface.parseLog(event);
        expect(parsedLog.args.shipmentId).to.equal(shipmentId);
        expect(parsedLog.args.origin).to.equal(origin);
        expect(parsedLog.args.destination).to.equal(destination);

        // Verify stored data
        const shipment = await supplyChain.getShipment(shipmentId);
        expect(shipment.shipmentId).to.equal(shipmentId);
        expect(shipment.origin).to.equal(origin);
        expect(shipment.destination).to.equal(destination);
        expect(shipment.carrier).to.equal(carrier);
        expect(shipment.status).to.equal("Created");
    });

    it("Should fail if shipment ID already exists", async function () {
        const shipmentId = "SHIP-001";
        await supplyChain.createShipment(shipmentId, "A", "B", "C");

        await expect(
            supplyChain.createShipment(shipmentId, "X", "Y", "Z")
        ).to.be.revertedWith("Shipment already exists");
    });

    it("Should update shipment status with location and notes", async function () {
        const shipmentId = "SHIP-002";
        await supplyChain.createShipment(shipmentId, "Paris", "Berlin", "FedEx");

        const newStatus = "In Transit";
        const location = "Metz";
        const notes = "Cleared customs";

        const tx = await supplyChain.updateShipmentStatus(shipmentId, newStatus, location, notes);
        const receipt = await tx.wait();

        // Check for event
        const event = receipt.logs.find(log => {
            try {
                return supplyChain.interface.parseLog(log).name === "ShipmentUpdated";
            } catch (e) { return false; }
        });

        expect(event).to.not.be.undefined;
        const parsedLog = supplyChain.interface.parseLog(event);
        expect(parsedLog.args.shipmentId).to.equal(shipmentId);
        expect(parsedLog.args.status).to.equal(newStatus);
        expect(parsedLog.args.location).to.equal(location);

        // Verify updated status
        const shipment = await supplyChain.getShipment(shipmentId);
        expect(shipment.status).to.equal(newStatus);
    });

    it("Should record history correctly", async function () {
        const shipmentId = "SHIP-003";
        await supplyChain.createShipment(shipmentId, "Tokyo", "Osaka", "Yamato");

        // First update
        await supplyChain.updateShipmentStatus(shipmentId, "Picked Up", "Tokyo Hub", "Package received");

        // Second update
        await supplyChain.updateShipmentStatus(shipmentId, "In Transit", "Nagoya", "On truck");

        const history = await supplyChain.getShipmentHistory(shipmentId);

        // History should contain 3 entries: Created + 2 updates
        expect(history.length).to.equal(3);

        expect(history[0].status).to.equal("Created");
        expect(history[1].status).to.equal("Picked Up");
        expect(history[1].location).to.equal("Tokyo Hub");
        expect(history[2].status).to.equal("In Transit");
        expect(history[2].location).to.equal("Nagoya");
    });

    it("Should verify data integrity hash", async function () {
        const shipmentId = "SHIP-004";
        await supplyChain.createShipment(shipmentId, "Rome", "Milan", "Poste");

        const isValid = await supplyChain.verifyShipmentHash(shipmentId);
        expect(isValid).to.be.true;
    });

    it("Should enumerate all shipments", async function () {
        await supplyChain.createShipment("S1", "A", "B", "C");
        await supplyChain.createShipment("S2", "X", "Y", "Z");

        const allIds = await supplyChain.getAllShipments();
        expect(allIds.length).to.equal(2);
        expect(allIds).to.include("S1");
        expect(allIds).to.include("S2");

        const count = await supplyChain.getShipmentCount();
        expect(count).to.equal(2n);
    });
});
