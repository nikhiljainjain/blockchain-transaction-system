const chainUtil = require("../chain-util");
const Transaction = require("./transaction");
// const TransactionPool = require("./transaction-pool");
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
  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }
  createTransaction(recipient, amount, blockchain, transactionPool) {
    // console.log(blockchain);
    this.balance = this.calculateBalance(blockchain);
    if (amount > this.balance) {
      console.log(
        `Your amount ${amount} is exceeding  balance ${this.balance}`
      );
      return;
    }
    let transaction = transactionPool.existingTransaction(this.publicKey);
    if (transaction) {
      transaction.update(this, amount, recipient);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
      // console.log(this);
    }
    return transaction;
  }
  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    // console.log(blockchain.chain);
    blockchain.chain.forEach(block => {
      // console.log(block.data);
      block.data.forEach(transaction => {
        transactions.push(transaction);
      });
    });

    const walletInput = transactions.filter(
      transaction => transaction.input.address === this.publicKey
    );
    let startTime = 0;
    if (walletInput.length > 0) {
      const recentInput = walletInput.reduce((prev, current) => {
        prev.input.timestamp > current.input.timestamp ? prev : current;
      });
      balance = recentInput.outputs.find(
        output => output.address === this.publicKey
      ).amount;
      startTime = recentInput.input.timestamp;
    }
    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });
    return balance;
  }
  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "block-chain-wallet";
    return blockchainWallet;
  }
}
module.exports = Wallet;
