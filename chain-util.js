const EC = require("elliptic").ec;
const SHA256 = require("crypto-js/sha256");

const Uuid = require("uuid/v1");
const ec = new EC("secp256k1");
class chainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }
  static id() {
    return Uuid();
  }
  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }
  static verifySignature(publicKey, signature, dataHash) {
    return ec.keyFromPublic(publicKey, "hex").verify(dataHash, signature);
  }
}
module.exports = chainUtil;
