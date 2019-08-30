const EC = require("elliptic").ec;
const Uuid = require("uuid/v1");
const ec = new EC("secp256k1");
class chainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }
  static id() {
    return Uuid();
  }
}
module.exports = chainUtil;
