// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SupplyChain {
    struct Shipment {
        string shipmentId;
        string status;
        uint256 timestamp;
        address createdBy;
        string origin;
        string destination;
        string carrier;
        bytes32 dataHash; // Hash of shipment data for integrity verification
    }

    struct StatusUpdate {
        string status;
        uint256 timestamp;
        address updatedBy;
        string location;
        string notes;
    }

    // Mapping from shipmentId to Shipment details
    mapping(string => Shipment) public shipments;
    // Mapping to keep track of all shipment IDs for enumeration
    string[] public allShipmentIds;
    // Mapping from shipmentId to history of status updates
    mapping(string => StatusUpdate[]) public shipmentHistory;

    event ShipmentCreated(
        string indexed shipmentId, 
        address indexed createdBy, 
        uint256 timestamp,
        bytes32 dataHash,
        string origin,
        string destination
    );
    
    event ShipmentUpdated(
        string indexed shipmentId, 
        string status, 
        uint256 timestamp,
        address indexed updatedBy,
        string location
    );

    /**
     * @dev Create a new shipment with detailed information
     * @param _shipmentId Unique identifier for the shipment
     * @param _origin Origin location
     * @param _destination Destination location
     * @param _carrier Carrier/shipping company name
     */
    function createShipment(
        string memory _shipmentId,
        string memory _origin,
        string memory _destination,
        string memory _carrier
    ) public {
        require(bytes(shipments[_shipmentId].shipmentId).length == 0, "Shipment already exists");

        // Generate hash of shipment data for integrity
        bytes32 dataHash = keccak256(abi.encodePacked(
            _shipmentId,
            _origin,
            _destination,
            _carrier,
            block.timestamp,
            msg.sender
        ));

        Shipment memory newShipment = Shipment({
            shipmentId: _shipmentId,
            status: "Created",
            timestamp: block.timestamp,
            createdBy: msg.sender,
            origin: _origin,
            destination: _destination,
            carrier: _carrier,
            dataHash: dataHash
        });

        shipments[_shipmentId] = newShipment;
        allShipmentIds.push(_shipmentId);
        
        // Add initial status to history
        shipmentHistory[_shipmentId].push(StatusUpdate({
            status: "Created",
            timestamp: block.timestamp,
            updatedBy: msg.sender,
            location: _origin,
            notes: "Shipment created"
        }));

        emit ShipmentCreated(_shipmentId, msg.sender, block.timestamp, dataHash, _origin, _destination);
    }

    /**
     * @dev Update shipment status with location and notes
     * @param _shipmentId Shipment identifier
     * @param _status New status
     * @param _location Current location
     * @param _notes Additional notes
     */
    function updateShipmentStatus(
        string memory _shipmentId, 
        string memory _status,
        string memory _location,
        string memory _notes
    ) public {
        require(bytes(shipments[_shipmentId].shipmentId).length > 0, "Shipment does not exist");

        Shipment storage currentShipment = shipments[_shipmentId];
        currentShipment.status = _status;
        currentShipment.timestamp = block.timestamp;

        // Record detailed history
        shipmentHistory[_shipmentId].push(StatusUpdate({
            status: _status,
            timestamp: block.timestamp,
            updatedBy: msg.sender,
            location: _location,
            notes: _notes
        }));

        emit ShipmentUpdated(_shipmentId, _status, block.timestamp, msg.sender, _location);
    }

    /**
     * @dev Get shipment details
     */
    function getShipment(string memory _shipmentId) public view returns (Shipment memory) {
        require(bytes(shipments[_shipmentId].shipmentId).length > 0, "Shipment does not exist");
        return shipments[_shipmentId];
    }

    /**
     * @dev Get full shipment history
     */
    function getShipmentHistory(string memory _shipmentId) public view returns (StatusUpdate[] memory) {
        require(bytes(shipments[_shipmentId].shipmentId).length > 0, "Shipment does not exist");
        return shipmentHistory[_shipmentId];
    }

    /**
     * @dev Get all shipment IDs
     */
    function getAllShipments() public view returns (string[] memory) {
        return allShipmentIds;
    }

    /**
     * @dev Get total number of shipments
     */
    function getShipmentCount() public view returns (uint256) {
        return allShipmentIds.length;
    }

    /**
     * @dev Verify shipment data integrity
     */
    function verifyShipmentHash(string memory _shipmentId) public view returns (bool) {
        require(bytes(shipments[_shipmentId].shipmentId).length > 0, "Shipment does not exist");
        
        Shipment memory shipment = shipments[_shipmentId];
        StatusUpdate memory firstUpdate = shipmentHistory[_shipmentId][0];
        
        bytes32 computedHash = keccak256(abi.encodePacked(
            shipment.shipmentId,
            shipment.origin,
            shipment.destination,
            shipment.carrier,
            firstUpdate.timestamp,
            shipment.createdBy
        ));
        
        return computedHash == shipment.dataHash;
    }
}
