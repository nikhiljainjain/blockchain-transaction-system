const Block = require("./block.js");
class BlockChain {
  constructor() {
    //initialize chain with genesis
    this.chain = [Block.genesis()];
  }
  //adding new block

  addblock(data) {
    const block = Block.mine(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
    // console.log(this.chain);
    return block;
  }
  isValidChain(chain) {
    // console.log(JSON.stringify(chain[0]));
    // console.log("--------------------");
    // console.log(JSON.stringify(Block.genesis()));
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      //   console.log(chain[0] + "dnnnnf" + chain[1]);
      //   console.log(Block.blockHash(block).toString());

      if (
        lastBlock.hash !== block.prevHash ||
        block.hash !== Block.blockHash(block)
      ) {
        return false;
      }
    }
    return true;
  }
  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("new chain is shorter in length");
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log("not a valid chain");
      return;
    } else {
      console.log("Replacing with new chain");
      this.chain = newChain;
    }
  }
}
module.exports = BlockChain;
