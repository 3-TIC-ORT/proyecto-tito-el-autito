import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

export const generateToken = (username) => {
    return Buffer.from(username + Date.now()).toString("base64");
  };