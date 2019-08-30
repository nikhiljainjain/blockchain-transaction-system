const chainUtil = require("../chain-util");
const { INITIAL_BALANCE } = require("../config");
class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = chainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }
  toString() {
    return `Wallet-
      balance:${this.balance}
      publicKey:${this.publicKey.toString()}`;
  }
}
module.exports = Wallet;
