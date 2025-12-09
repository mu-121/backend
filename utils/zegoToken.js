"use strict";
const { createCipheriv } = require("crypto");

// Error codes mirror the upstream helper for easier debugging
const ErrorCode = {
  success: 0,
  appIDInvalid: 1,
  userIDInvalid: 3,
  secretInvalid: 5,
  effectiveTimeInSecondsInvalid: 6,
};

const makeRandomIv = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < 16; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
};

const getAlgorithm = (keyBase64) => {
  const key = Buffer.from(keyBase64);
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 24:
      return "aes-192-cbc";
    case 32:
      return "aes-256-cbc";
    default:
      throw new Error("Invalid key length: " + key.length);
  }
};

const aesEncrypt = (plainText, key, iv) => {
  const cipher = createCipheriv(getAlgorithm(key), key, iv);
  cipher.setAutoPadding(true);
  const encrypted = cipher.update(plainText);
  const final = cipher.final();
  return Uint8Array.from(Buffer.concat([encrypted, final])).buffer;
};

/**
 * Generate Zego Token04 (copied from the official helper repo)
 * @param {number} appId
 * @param {string} userId
 * @param {string} secret 32-byte server secret
 * @param {number} effectiveTimeInSeconds
 * @param {string} payload optional payload (JSON string)
 * @returns {string} token
 */
const generateToken04 = (appId, userId, secret, effectiveTimeInSeconds, payload = "") => {
  if (!appId || typeof appId !== "number") {
    throw { errorCode: ErrorCode.appIDInvalid, errorMessage: "appID invalid" };
  }
  if (!userId || typeof userId !== "string") {
    throw { errorCode: ErrorCode.userIDInvalid, errorMessage: "userId invalid" };
  }
  if (!secret || typeof secret !== "string" || secret.length !== 32) {
    throw {
      errorCode: ErrorCode.secretInvalid,
      errorMessage: "secret must be a 32 byte string",
    };
  }
  if (!effectiveTimeInSeconds || typeof effectiveTimeInSeconds !== "number") {
    throw {
      errorCode: ErrorCode.effectiveTimeInSecondsInvalid,
      errorMessage: "effectiveTimeInSeconds invalid",
    };
  }

  const createTime = Math.floor(Date.now() / 1000);
  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: Math.ceil((-2147483648 + (2147483647 + 2147483648)) * Math.random()),
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload,
  };

  const plainText = JSON.stringify(tokenInfo);
  const iv = makeRandomIv();
  const encryptBuf = aesEncrypt(plainText, secret, iv);
  const b1 = new Uint8Array(8);
  const b2 = new Uint8Array(2);
  const b3 = new Uint8Array(2);
  new DataView(b1.buffer).setBigInt64(0, BigInt(tokenInfo.expire), false);
  new DataView(b2.buffer).setUint16(0, iv.length, false);
  new DataView(b3.buffer).setUint16(0, encryptBuf.byteLength, false);

  const buf = Buffer.concat([
    Buffer.from(b1),
    Buffer.from(b2),
    Buffer.from(iv),
    Buffer.from(b3),
    Buffer.from(encryptBuf),
  ]);
  return "04" + Buffer.from(Uint8Array.from(buf).buffer).toString("base64");
};

module.exports = { generateToken04, ErrorCode };

