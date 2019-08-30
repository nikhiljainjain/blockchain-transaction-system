const BlockChain = require("./index.js");
const Block = require("./block");

describe("Blockchain", () => {
  let bc, bc2;
  beforeEach(() => {
    bc = new BlockChain();
    bc2 = new BlockChain();
  });
  it("first block is genesis", () => {
    expect(bc.chain[0].toString()).toEqual(Block.genesis().toString());
  });
  it("adds a new block", () => {
    const data = "foo";
    bc.addblock(data);
    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });
  it("valid chain", () => {
    const data = "foo";
    bc2.addblock(data);
    // console.log(bc2.toString());
    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });
  it("invalid genesis block", () => {
    bc2.chain[0].data = "not foo";
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });
  it("invalid chain", () => {
    bc2.addblock(",xnnn");

    bc2.chain[1].data = "notfoo";

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });
  it("repalces chain with valid one", () => {
    bc2.addblock("goo");
    bc.replaceChain(bc2.chain);
    // console.log(bc.chain);
    // console.log(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  });
  it("does not repalces chain with less length", () => {
    bc.addblock("goo");
    bc.replaceChain(bc2.chain);
    expect(bc.chain).not.toEqual(bc2.chain);
  });
});
