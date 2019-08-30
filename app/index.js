const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../Blockchain");
const P2PServer = require("./P2Pserver");
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const bc = new Blockchain();
const P2pServer = new P2PServer(bc);
app.use(bodyParser.json());
app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});
app.post("/mine", (req, res) => {
  const block = bc.addblock(req.body.data);
  console.log(`New block was added :${block.toString()}`);
  P2pServer.syncChains();
  res.redirect("/blocks");
});
app.listen(HTTP_PORT, () => {
  console.log(`Port is listening on ${HTTP_PORT}`);
});
P2pServer.listen();
