const Websocket = require("ws");
const P2P_PORT = process.env.P2P_PORT || 5001;
const MESSAGE_TYPES = {
  chain: "CHAIN",
  transaction: "TRANSACTION",
  clear_transactions: "CLEAR_TRANSACTIONS"
};
//Console comand
//HTTP_PORT=3002 P2P_PORT=5002 PEERS=address1,address2 npm start
// https://stackoverflow.com/questions/13333221/how-to-change-value-of-process-env-port-in-node-js
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

class P2P_Server {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }
  //for starting server
  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    //switches on the server an listen to connection requests and object socket is created
    server.on("connection", socket => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer to peer on ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }
  //will push sockets to array of sockets
  connectSocket(socket) {
    this.sockets.push(socket);
    console.log("socket connected");
    this.messageHandler(socket);
    this.sendChain(socket);
  }
  //handles message from peers
  messageHandler(socket) {
    socket.on("message", message => {
      const data = JSON.parse(message);
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }
      // console.log("data", data);
    });
  }
  sendChain(socket) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain
      })
    );
  }
  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => {
      this.sendTransaction(socket, transaction);
    });
  }
  sendTransaction(socket, transaction) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction: transaction
      })
    );
  }
  syncChains() {
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    });
  }
  syncTransaction() {
    this.sockets.forEach(socket => {
      this.sendTransaction(socket, transaction);
    });
  }
  broadcastClearTransaction() {
    this.sockets.forEach(socket => {
      socket.send(JSON.stringify({ type: MESSAGE_TYPES.clear_transactions }));
    });
  }
}

module.exports = P2P_Server;
