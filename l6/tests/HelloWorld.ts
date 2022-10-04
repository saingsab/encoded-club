import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HelloWorld } from "../typechain-types";

describe("HellWorld",  () => {
    let helloWorldContract: HelloWorld;
    let accounts: SignerWithAddress[];

    beforeEach(async () => {
        const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
        helloWorldContract = await helloWorldFactory.deploy() as HelloWorld;
        await helloWorldContract.deployed();
        
    });

    it("Should give a Hello World", async () => {
        const helloWorldText = await helloWorldContract.helloWorld();
        expect(helloWorldText).to.eq("Hello World");
    });

    it("Should set owner to deployer account",async () => {
        const accounts = await ethers.getSigners();
        const contractOwner = await helloWorldContract.owner();
        expect(contractOwner).to.eq(accounts[0].address);
    });

    it("Should not allow other than owner to call transferOwnership",async () => {
        const accounts = await ethers.getSigners();
        await expect(
            helloWorldContract.connect(accounts[1])
            .transferOwnership(accounts[1].address)
        ).to.be.revertedWith("Caller is not the owner");
    });

    it("Should execute transferOwnership correctly",async () => {
        const newOwner = accounts[1].address;
        await helloWorldContract.connect(accounts[0]).transferOwnership(newOwner);
        const contractOwner = await helloWorldContract.owner();
        await expect(contractOwner).to.eq(newOwner);
    });

    it("Should not allow anyone other then owner to change text",async () => {
        await expect(
            helloWorldContract.connect(accounts[1])
            .setText("")
        ).to.be.revertedWith("Caller is not the owner");
    });

    it("Should change text correctly",async () => {
        const newText: string = "NEW_TEXT";
        await helloWorldContract.setText(newText);
        expect(await helloWorldContract.helloWorld()).to.eq(newText);
    });

});