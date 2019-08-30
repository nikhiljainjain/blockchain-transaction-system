const Websocket = require("ws");
const P2P_PORT = process.env.P2P_PORT || 5001;
//Console comand
//HTTP_PORT=3002 P2P_PORT=5002 PEERS=address1,address2 npm start
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

class P2P_Server {
  constructor(blockchain) {
    this.blockchain = blockchain;
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
      // console.log("data", data);
      this.blockchain.replaceChain(data);
    });
  }
  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }
  syncChains() {
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    });
  }
}
module.exports = P2P_Server;
