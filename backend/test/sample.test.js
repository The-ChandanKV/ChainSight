import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("Sample JS", function () {
    it("Should run", function () {
        console.log("Sample JS test running");
        expect(true).to.be.true;
    });
});
