import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { TokenSale, MyERC20Token } from "../typechain-types";

const ERC20_TOKEN_RATIO = 5;

describe("NFT Shop", async () =>  {
    let tokenSaleContract: TokenSale;
    let erc20Token: MyERC20Token;
    let deployer: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;

    beforeEach( async () => {
        [deployer, acc1, acc2] = await ethers.getSigners();
        const erc20TokenContractFactory = await ethers.getContractFactory("MyERC20Token");
        const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale");
        erc20Token = await erc20TokenContractFactory.deploy();
        await erc20Token.deployed();

        tokenSaleContract = await tokenSaleContractFactory.deploy(ERC20_TOKEN_RATIO, erc20Token.address);
        await tokenSaleContract.deployed();
        const MINTER_ROLE = await erc20Token.MINTER_ROLE();
        const grantRoleTx = await erc20Token.grantRole(
          MINTER_ROLE, 
          tokenSaleContract.address
        );
        await grantRoleTx.wait();
    })
  beforeEach(async () =>  {});

  describe("When the Shop contract is deployed", async () =>  {
    it("defines the ratio as provided in parameters", async () =>  {
      const rate = await tokenSaleContract.ratio();
      expect(rate).to.eq(ERC20_TOKEN_RATIO);
    });

    it("uses a valid ERC20 as payment token", async () =>  {
      const paymentTokenAddress = await tokenSaleContract.paymentToken();
      expect(paymentTokenAddress).to.eq(erc20Token.address);
      const erc20TokenFactory = await ethers.getContractFactory("MyERC20Token");
      const paymentTokenContract = erc20TokenFactory.attach(paymentTokenAddress);
      const myBalance = await paymentTokenContract.balanceOf(deployer.address);
      expect(myBalance).to.eq(0);
      const totalSupply = await paymentTokenContract.totalSupply();
      expect(totalSupply).to.eq(0);
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () =>  {
    const amountToBeSendBn = ethers.utils.parseEther("1");
    let balanceBeforeBn: BigNumber;
    let purchaseGasCost: BigNumber;

    beforeEach(async () => {
      balanceBeforeBn = await acc1.getBalance();
      const purchaseTokenTx = await tokenSaleContract
      .connect(acc1)
      .purchaseTokens({value: amountToBeSendBn});
      const purchaseTokensTxReceipt = await purchaseTokenTx.wait();
      const gasUnitsUsed = purchaseTokensTxReceipt.gasUsed;
      const gasPrice = purchaseTokensTxReceipt.effectiveGasPrice;
      purchaseGasCost = gasUnitsUsed.mul(gasPrice);
    })

    it("charges the correct amount of ETH", async () =>  {
      const balanceAfterBn = await acc1.getBalance();
      const diff = balanceBeforeBn.sub(balanceAfterBn);
      const expectedDiff = amountToBeSendBn.add(purchaseGasCost);
      expect(expectedDiff).to.eq(diff);
    });

    it("gives the correct amount of tokens", async () =>  {
      const acc1Balance = await erc20Token.balanceOf(acc1.address);
      expect(acc1Balance).to.eq(amountToBeSendBn.div(ERC20_TOKEN_RATIO));
    });

    it("increase the balance of ETH in the contract", async () => {
      const contractBalanceBn = await ethers.provider.getBalance(
        tokenSaleContract.address
      );

    }) 
  });

  describe("When a user burns an ERC20 at the Token contract", async () =>  {
    let burnGasCosts: BigNumber;
    beforeEach(async () => {
      let burnTokensTx = await tokenSaleContract
        .connect(acc1)
        .burnTokens(ammountToBeReceived);
      const purchaseTokensTxReceipt = await purchaseTokensTx.wait();
      const gasUnitsUsed = purchaseTokensTxReceipt.gasUsed;
      const gasPrice = purchaseTokensTxReceipt.effectiveGasPrice;
      burnGasCosts = gasUnitsUsed.mul(gasPrice);
    });
  
    it("gives the correct amount of ETH", async () =>  {
      throw new Error("Not implemented");
    });

    it("burns the correct amount of tokens", async () =>  {
      throw new Error("Not implemented");
    });
  });

  describe("When a user purchase a NFT from the Shop contract", async () =>  {
    it("charges the correct amount of ETH", async () =>  {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", async () =>  {
      throw new Error("Not implemented");
    });

    it("update the pool account correctly", async () =>  {
      throw new Error("Not implemented");
    });

    it("favors the pool with the rounding", async () =>  {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () =>  {
    it("gives the correct amount of ERC20 tokens", async () =>  {
      throw new Error("Not implemented");
    });
    it("updates the pool correctly", async () =>  {
      throw new Error("Not implemented");
    });
  });

  //describe("When the owner withdraw from the Shop contract", async () =>  {
    it("recovers the right amount of ERC20 tokens", async () =>  {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", async () =>  {
      throw new Error("Not implemented");
    });
  });