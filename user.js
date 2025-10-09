// db.js
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

const users = [
    { username: "admin", password: "1234" },
    { username: "olivia", password: "clave123" }
  ];
  
  export const getUser = (username) => {
    return users.find(u => u.username === username);
  };