import * as dotenv from "dotenv";
import { ethers } from "hardhat";

const TOKENS_MINTED = ethers.utils.parseEther("1");

const main = async () =>{
  const [deployer, acc1, acc2] = await ethers.getSigners();
  const myTokenContractFactory = await ethers.getContractFactory("MyToken");
  const myTokenContract = await myTokenContractFactory.deploy();
  await myTokenContract.deployed();
  console.log(`MyToken contract was deployed at the address of ${myTokenContract.address}`);
  const totalSupply = await myTokenContract.totalSupply();
  console.log(`\nThe initial totalSupply of this contract after deployment is ${totalSupply}`);

  console.log("Minting new tokens for Acc1")
  const minTx = await myTokenContract.mint(
    acc1.address, 
    TOKENS_MINTED);
  await minTx.wait();
  const totalSupplyAfter =  await myTokenContract.totalSupply();
  console.log(`\nThe totalSupply of this contract after minted ${ethers.utils.formatEther(totalSupplyAfter)}`);
  
  console.log("What is the currect votePower of acc1?\n");
  const acciInitialVotingPowerAfterMint = await myTokenContract.getVotes(acc1.address);
  console.log(`The vote valance of acc1 after minting is ${ethers.utils.formatEther(
    acciInitialVotingPowerAfterMint
  )}`);

  console.log("Delegating from acc1 to acc1 \n");
  const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();
  const acc1VotingPowerAfterDelegate = await myTokenContract.getVotes(acc1.address);
  console.log(`The vote balance acc1 after delegate ${ethers.utils.formatEther(acc1VotingPowerAfterDelegate)}\n`)
    
  const currentBlock = await ethers.provider.getBlock("latest");
  console.log(`The current block number is ${currentBlock.number}\n`);
  const minTx2 = await myTokenContract.mint(acc1.address, TOKENS_MINTED);
  await minTx2.wait();
  const currentBlock2 = await ethers.provider.getBlock("latest");
  console.log(`The current Block Number is ${currentBlock2.number}\n`);
  
  const minTx3 = await myTokenContract.mint(acc1.address, TOKENS_MINTED);
  await minTx3.wait();
  const currentBlock3 = await ethers.provider.getBlock("latest");
  console.log(`The current Block Number is ${currentBlock3.number}\n`);

  const pastVotes = await Promise.all([
     myTokenContract.getPastVotes(acc1.address, 4),
     myTokenContract.getPastVotes(acc1.address, 3),
     myTokenContract.getPastVotes(acc1.address, 2),
     myTokenContract.getPastVotes(acc1.address, 1),
     myTokenContract.getPastVotes(acc1.address, 0),
  ]);
  console.log({ pastVotes });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});