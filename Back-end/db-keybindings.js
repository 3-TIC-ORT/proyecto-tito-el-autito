import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

    let conectar = JSON.parse(fs.readFileSync("key.json", "utf-8"));
let usuarios = [];
let