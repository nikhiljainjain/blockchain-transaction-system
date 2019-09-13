const Transaction = require("../Wallet/transaction");
const Wallet = require("../Wallet/index");
// const Blockchain = require("../Blockchain");
class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }
  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    // console.log(validTransactions + "1231");
    const block = this.blockchain.addblock(validTransactions);
    this.p2pServer.syncChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransaction();
    return block;
  }
}
module.exports = Miner;
