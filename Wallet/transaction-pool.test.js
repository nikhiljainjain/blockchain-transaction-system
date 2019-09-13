const Wallet = require("./index");
const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Blockchain = require("../Blockchain");

describe("TransactionPool", () => {
  let wallet, transaction, tp;
  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    transaction = wallet.createTransaction("Aadish9599", 30, bc, tp);
    // console.log(transaction);
  });
  it("adds a transaction to pool", () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(
      transaction
    );
  });
  it("updates transaction in pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 40, "Aadish4446");
    tp.updateOrAddTransaction(newTransaction);
    expect(
      JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))
    ).not.toEqual(oldTransaction);
  });
  it("clears the tp", () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe("mix valid and corrupt transaction", () => {
    let validTransactions;
    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction("chvhvvxkz", 30, bc, tp);
        if (i % 2 == 0) {
          transaction.input.amount = 9999999;
        } else {
          validTransactions.push(transaction);
          // console.log(validTransactions);
        }
      }
    });
    it("shows difference between valid and corrupt transaction", () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(
        JSON.stringify(validTransactions)
      );
    });
    it("grabs valid transactions", () => {
      // console.log(tp.validTransactions());
      // console.log(validTransactions.outputs);
      expect(tp.validTransactions()).toEqual(validTransactions);
    });
  });
});
