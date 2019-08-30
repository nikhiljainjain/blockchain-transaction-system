const chainUtil = require("../chain-util");
class Transaction {
  constructor() {
    this.id = chainUtil.id();
    this.input = null;
    this.outputs = [];
  }
  newTransaction(senderWallet, amount, recipient) {
    const transaction = new Transaction();
    if (senderWallet.balance < amount) {
      console.log(`Your ${amount} is exceeding your balance.`);
      return;
    }
    transaction.outputs.push(...[]);
  }
}
