const Wallet = require("./index");
const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Blockchain = require("../Blockchain");
const { INITIAL_BALANCE } = require("../config");
describe("wallet", () => {
  let wallet, tp;
  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
    // console.log(bc);
  });

  describe("creating a transaction", () => {
    let transaction, sendAmount, recipient;
    beforeEach(() => {
      sendAmount = 60;
      recipient = "Aadish4656";
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
      // console.log(transaction);
    });
    describe("same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, tp);
      });
      it(`doubles ${sendAmount} subtracted from wallet`, () => {
        expect(
          transaction.outputs.find(
            output => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - 2 * sendAmount);
      });
      it(`clones the ${sendAmount} for the recipient `, () => {
        expect(
          transaction.outputs
            .filter(output => output.address === recipient)
            .map(output => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
  describe("calculating the balance", () => {
    let addBalance, repeatAdd, senderWallet;
    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;

      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
      }
      bc.addblock(tp.transactions);
    });
    it("calculates the balance for recipent", () => {
      // console.log(wallet.calculateBalance(bc));
      expect(wallet.calculateBalance(bc)).toEqual(
        INITIAL_BALANCE + addBalance * repeatAdd
      );
    });
    it("calculates the balance for sender", () => {
      // console.log(wallet.calculateBalance(bc));
      expect(senderWallet.calculateBalance(bc)).toEqual(
        INITIAL_BALANCE - addBalance * repeatAdd
      );
    });
    describe("recipent conduct a transsction", () => {
      let subtractBalance, recipientBalance;
      beforeEach(() => {
        tp.clear();
        subtractBalance = 60;
        recipientBalance = wallet.calculateBalance(bc);
        wallet.createTransaction(
          senderWallet.publicKey,
          subtractBalance,
          bc,
          tp
        );
        bc.addblock(tp.transactions);
      });
      describe("sender wallet does another transaction", () => {
        beforeEach(() => {
          tp.clear();
          senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
          bc.addblock(tp.transactions);
        });
        it("calculate the recipient balance", () => {
          expect(wallet.calculateBalance(bc)).toEqual(
            recipientBalance - subtractBalance + addBalance
          );
        });
      });
    });
  });
});
