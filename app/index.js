const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../Blockchain");
const P2PServer = require("./P2Pserver");
const Wallet = require("../Wallet/index");
const Miner = require("./miner");
const TransactionPool = require("../Wallet/transaction-pool");
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2PServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addblock(req.body.data);
  console.log(`New block was added :${block.toString()}`);
  p2pServer.syncChains();
  res.redirect("/blocks");
});

app.get("/transactions", (req, res) => {
  res.json(tp.transactions);
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  p2pServer.broadcastTransaction(transaction);
  console.log(transaction);
  res.redirect("/transactions");
});

app.get("/public_key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get("/mine-transaction", (req, res) => {
  const block = miner.mine();
  console.log(`New BLock added: ${block.toString()}`);
  res.redirect("/blocks");
});

app.listen(HTTP_PORT, () => {
  console.log(`Port is listening on ${HTTP_PORT}`);
});

p2pServer.listen();