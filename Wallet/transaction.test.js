const Transaction = require("./transaction");
const Wallet = require("./index");
const { MINING_REWARD } = require("../config");
describe("Transaction", () => {
  let transaction, wallet, amount, recipient;
  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = "a@dish09";
    // console.log(wallet);
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });
  it("outputs the `amount` subtracted balance", () => {
    expect(
      transaction.outputs.find(output => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });
  it("outputs the `amount`", () => {
    expect(
      transaction.outputs.find(output => output.address === recipient).amount
    ).toEqual(amount);
  });
  it("inputs the balance of the wallet", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it("validates the correct transaction", () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it("invalidates the wrong transaction", () => {
    transaction.outputs[0].amount = 500000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe("exceeds balance", () => {
    beforeEach(() => {
      // wallet = new Wallet();
      // recipient = "a@dish09";

      amount = 500000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });
    it("No transaction created", () => {
      expect(transaction).toEqual(undefined);
    });
  });
  describe("updating a transaction", () => {
    let nextAmount, nextRecipient;
    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = "Aadish@7024";
      transaction = transaction.update(wallet, nextAmount, nextRecipient);
    });
    it(`deducts amount from sender's  wallet`, () => {
      expect(
        transaction.outputs.find(output => output.address === wallet.publicKey)
          .amount
      ).toEqual(wallet.balance - amount - nextAmount);
    });
    it(`show the amount for next recioient`, () => {
      expect(
        transaction.outputs.find(output => output.address === nextRecipient)
          .amount
      ).toEqual(nextAmount);
    });
  });
  describe("creating  a reward", () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(
        wallet,
        Wallet.blockchainWallet()
      );
    });
    it(`reward the miner's wallet`, () => {
      expect(
        transaction.outputs.find(output => output.address === wallet.publicKey)
          .amount
      ).toEqual(MINING_REWARD);
    });
  });
});
