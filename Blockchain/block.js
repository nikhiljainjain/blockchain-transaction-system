const chainUtil = require("../chain-util");
const SHA512 = require("crypto-js/sha256");

const { Difficulty, Mine_Rate } = require("../config");
class Block {
  constructor(index, prevHash, timestamp, hash, data, nonce, difficulty) {
    this.data = data;
    this.timestamp = timestamp;
    this.hash = hash;
    this.prevHash = prevHash;
    this.index = index;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  //for converting to string
  toString() {
    return `Block-
      Timestamp : ${this.timestamp}
      Data:${this.data}
      Hash:${this.hash}
      PrevHash:${this.prevHash}
      Nonce:${this.nonce}
      Diffculty:${this.difficulty}
      Index:${this.index}`;
  }
  //first block
  static genesis() {
    return new Block(1, "0", "0", chainUtil.hash(0), [], 0, 4);
  }
  // for new block
  static mine(lastBlock, data) {
    let hash, timestamp;
    const index = lastBlock.index + 1;
    const prevHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(
        data,
        prevHash,
        timestamp,
        index,
        nonce,
        difficulty
      ).toString();
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));
    return new this(index, prevHash, timestamp, hash, data, nonce, difficulty);
  }
  static hash(data, prevHash, timestamp, index, nonce, difficulty) {
    return chainUtil.hash(
      `${data}${timestamp}${index}${prevHash}${nonce}${difficulty}`
    );
  }
  ///
  static blockHash(block) {
    // variables of block copied to below variables
    const { timestamp, index, data, prevHash, nonce, difficulty } = block;
    return Block.hash(data, prevHash, timestamp, index, nonce, difficulty);
  }
  static adjustDifficulty(lastBlock, currentime) {
    let { difficulty } = lastBlock;

    if (currentime - lastBlock.timestamp < Mine_Rate) {
      difficulty++;
    } else if (currentime - lastBlock.timestamp > Mine_Rate) {
      --difficulty;
    }
    return difficulty;
  }
}
module.exports = Block;
