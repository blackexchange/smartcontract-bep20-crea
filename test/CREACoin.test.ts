import {
  loadFixture, time
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("CREACoin", function () {

  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const CREACoin = await hre.ethers.getContractFactory("CREACoin");
    const creaCoin = await CREACoin.deploy();

    return { creaCoin, owner, otherAccount };
  }

  it("Should have correct name", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const name = await creaCoin.name();

    expect(name).to.equal("CREACoin");
  });
  
  it("Should have correct symbol", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const symbol = await creaCoin.symbol();

    expect(symbol).to.equal("CREAC");
  });

  it("Should have correct decimals", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const decimals = await creaCoin.decimals();

    expect(decimals).to.equal(18);
  });

  it("Should have correct total Supply", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const totalSupply = await creaCoin.totalSupply();

    expect(totalSupply).to.equal(1000n * 10n ** 18n);
  });


  
  it("Should have correct amount owner token", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const amount = await creaCoin.balanceOf(owner.address);

    expect(amount).to.equal(1000n * 10n ** 18n);
  });


  
  it("Should get balance", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const totalSupply = await creaCoin.balanceOf(owner.address);

    expect(totalSupply).to.greaterThan(0);
  });

    
  it("Should transfer", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const balanceOwnerBefore = await creaCoin.balanceOf(owner.address);
    const balanceOtherAccountBefore = await creaCoin.balanceOf(otherAccount.address);

    await creaCoin.transfer(otherAccount.address, 1n);
    
    const balanceOwnerAfter = await creaCoin.balanceOf(owner.address);
    const balanceOtherAccountAfter = await creaCoin.balanceOf(otherAccount.address);

    expect(balanceOwnerAfter).to.equal(balanceOwnerBefore - 1n);
    expect(balanceOtherAccountAfter).to.equal(balanceOtherAccountBefore + 1n);
  });


  
  it("Should transfer error", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const instance = creaCoin.connect(otherAccount);

    await expect(instance.transfer(owner, 20n)).to.be.revertedWithCustomError(creaCoin,"ERC20InsufficientBalance");
  });


  
  it("Should aprove", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    await creaCoin.approve(otherAccount.address, 1n);

    const value = await creaCoin.allowance(owner.address, otherAccount.address);

    await expect(value).to.be.equal(1n);
  });


  it("Should transfer from ", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const balanceOwnerBefore = await creaCoin.balanceOf(owner.address);
    const balanceOtherAccountBefore = await creaCoin.balanceOf(otherAccount.address);

    await creaCoin.approve(otherAccount.address, 10n);

    const instance = creaCoin.connect(otherAccount);

    await instance.transferFrom(owner.address, otherAccount.address, 5n);

    const balanceOwnerAfter = await creaCoin.balanceOf(owner.address);
    const balanceOtherAccountAfter = await creaCoin.balanceOf(otherAccount.address);

    const allowance = await instance.allowance(owner.address, otherAccount.address);

    expect(balanceOwnerAfter).to.equal(balanceOwnerBefore - 5n);
    expect(balanceOtherAccountAfter).to.equal(balanceOtherAccountBefore + 5n);
    expect(allowance).to.equal(5n);
  });


  
  it("Should NOT transfer from by NOT ALLOWANCE ", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const instance = creaCoin.connect(otherAccount);

    await expect(instance.transferFrom(owner.address,otherAccount.address, 1n))
      .to.be.revertedWithCustomError(creaCoin,"ERC20InsufficientAllowance");

  });


  
  it("Should NOT transfer from by NOT FUNDS", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const instance = creaCoin.connect(otherAccount);
    await instance.approve(owner.address, 1n);

    await expect(creaCoin.transferFrom(otherAccount.address,owner.address, 1n))
      .to.be.revertedWithCustomError(creaCoin,"ERC20InsufficientBalance");

  });


    
  it("Should mint once", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const amount = 1000n;
    await creaCoin.setMintAmount(amount);

    const balanceBefore = await creaCoin.balanceOf(otherAccount);
   
    const balanceAfter = await creaCoin.balanceOf(otherAccount);
    expect(balanceAfter ==  balanceBefore + amount );

  });

  
  it("Should mint twice different account", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const amount = 1000n;
    await creaCoin.setMintAmount(amount);

    const balanceBeforeOther = await creaCoin.balanceOf(owner);
    await creaCoin.mint(owner);

    await creaCoin.mint(otherAccount);

    const balanceAfterOther = await creaCoin.balanceOf(owner);

    expect(balanceAfterOther ==  balanceBeforeOther + amount );

  });

  
  it("Should mint twice same account, time different", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const amount = 1000n;
    const timeDelay = 60 * 60 * 24 * 2;

    await creaCoin.setMintAmount(amount);

    const balanceBeforeOwner = await creaCoin.balanceOf(otherAccount);

    await creaCoin.mint(otherAccount);

    await time.increase(timeDelay);

    await creaCoin.mint(otherAccount);

    const balanceAfterOwner= await creaCoin.balanceOf(otherAccount);

    expect(balanceAfterOwner ==  balanceBeforeOwner + amount );

  });


  it("Should NOT set mint amount if not owner", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const amount = 1000n;
    const instance = creaCoin.connect(otherAccount);

    await expect( instance.setMintAmount(amount)).revertedWith("You do not have permission.");

  });


  it("Should NOT set mint amount if not owner", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const amount = 1000n;
    const instance = creaCoin.connect(otherAccount);

    await expect( instance.setMintAmount(amount)).revertedWith("You do not have permission.");

  });


  
  it("Should NOT set mint delay if not owner", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const amount = 1000n;
    const instance = creaCoin.connect(otherAccount);

    await expect( instance.setMintDelay(amount)).revertedWith("You do not have permission.");

  });


   
  it("Should NOT mint", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    await expect( creaCoin.mint(otherAccount)).revertedWith("Minting is not enabled.");

  });


  
  it("Should mint twice same account", async function () {
    const {creaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const amount = 1000n;
    
    await creaCoin.setMintAmount(amount);
    
    await creaCoin.mint(otherAccount);

    await expect( creaCoin.mint(otherAccount)).revertedWith("You cannot mint twice in a row.");;

  });

});
