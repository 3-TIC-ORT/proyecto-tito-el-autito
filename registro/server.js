import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { addUser, getUser} from "./db.js";

subscribePOSTEvent("register", (data) => {
    const { username, password } = data;
  
    if (!username || !password) {
      return { error: "Faltan datos" };
    }
  
    const exist = getUser(username);
    if (exist) {
      return { error: "El usuario ya existe" };
    }
  
    const ok = addUser(username, password);
    if (!ok) {
      return { error: "No se pudo registrar" };
    }
  
    return { status: "ok", msg: "Usuario registrado correctamente" };
  });