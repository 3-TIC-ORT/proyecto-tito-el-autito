import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";  
  import { addUser, getUser } from "./db.js";
  import { generateToken } from "./utils.js";
  
  // -------------------------------
  // Eventos POST (login, register, comandos)
  // -------------------------------
  
  // Registro
  subscribePOSTEvent("register", (data) => {
    const { username, password } = data;
    if (!username || !password) return { error: "Faltan datos" };
  
    const ok = addUser(username, password);
    if (!ok) return { error: "Usuario ya existe" };
  
    return { status: "ok", msg: "Usuaxrio registrado" };
  });
  
  // Login
  subscribePOSTEvent("login", (data) => {
    const { username, password } = data;
    const user = getUser(username);
  
    if (!user || user.password !== password) {
      return { error: "Credenciales inválidas" };
    }
  
    const token = generateToken(username);
    return { status: "ok", token };
  });
  
  // Comando al auto
  subscribePOSTEvent("sendCommand", (data) => {
    // data = { command: "adelante" | "izquierda" | "frenar" }
    console.log(" Comando recibido:", data.command);
  
    // Podés integrar acá con Arduino/Raspberry
    return { status: "ok", executed: data.command };
  });
  
  // -------------------------------
  // Eventos GET (datos básicos)
  // -------------------------------
// PING (para testear que el servidor anda)
subscribeGETEvent("ping", () => {
  return { msg: "pong" };
});

// GET USER (recibe username como query param)
subscribeGETEvent("getUser", (query) => {
  const { username } = query;

  if (!username) {
    return { error: "Falta el username en la query" };
  }

  const user = getUser(username);
  if (!user) {
    return { error: "Usuario no encontrado" };
  }

  return { username: user.username };
});
  
  // -------------------------------
  // Real Time Events (push al frontend)
  // -------------------------------
  
  // Enviamos cada 5s info del auto
  setInterval(() => {
    const info = {
      bateria: Math.floor(Math.random() * 100),
      velocidad: Math.floor(Math.random() * 50),
      timestamp: new Date().toISOString()
    };
    realTimeEvent("statusAuto", info);
  }, 5000);
  
  // -------------------------------
  // Iniciar servidor
  // -------------------------------
  startServer(4000, true); // puerto 4000, modo DEBUG