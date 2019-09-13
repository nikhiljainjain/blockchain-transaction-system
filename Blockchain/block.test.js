const Block = require("./block.js");

describe("Block", () => {
  let data, lastBlock, block;
  //runs before every it test
  beforeEach(() => {
    data = "bar";
    lastBlock = Block.genesis();
    block = Block.mine(lastBlock, data);
    // console.log(block);
  });
  //for tests
  it("sets `data` to match input ", () => {
    expect(block.data).toEqual(data);
  });
  it("sets `lastHash` to match the hash of last block", () => {
    expect(block.prevHash).toEqual(lastBlock.hash);
  });
  it("checks the hash is equal to target", () => {
    expect(block.hash.toString().substring(0, block.difficulty)).toEqual(
      "0".repeat(block.difficulty)
    );
  });
  it("it lowers difficulty", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(
      block.difficulty - 1
    );
  });
  it("it increases difficulty", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(
      block.difficulty + 1
    );
  });
});
