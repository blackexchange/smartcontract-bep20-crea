import {ethers}  from "hardhat";
import { erc20 } from "../typechain-types/@openzeppelin/contracts/token";

async function main () {

    const creacoin =await ethers.deployContract("CREACoin");
    await creacoin.waitForDeployment();

    console.log(`Contract deployed at ${creacoin.target}`);

    
}

main().catch((error)=>{
    console.error(error);
    process.exitCode = 1;
});