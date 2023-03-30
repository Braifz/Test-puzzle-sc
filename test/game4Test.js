const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game4", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game4");
    const game = await Game.deploy();

    const signer = ethers.provider.getSigner(0);

    return { game, signer };
  }
  it("should be a winner", async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}

    const address = await signer.getAddress();
    await game.write(address);

    await game.win(address);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
