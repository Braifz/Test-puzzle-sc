const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }

  async function getAddress() {
    const threshold = 0x00ffffffffffffffffffffffffffffffffffffff;
    let address;
    while (true) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      address = await wallet.getAddress();
      if (address < threshold) {
        return { address, wallet };
      }
    }
  }

  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    const { wallet, address } = await getAddress();

    //the random address doesnt have gas, send some gas to it
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
    });

    // good luck
    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
