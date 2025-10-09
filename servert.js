import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { addUser, getUser } from "./db.js";
import { generateToken } from "./utils.js";

// -------------------------------
// Registro
// -------------------------------
subscribePOSTEvent("register", (data) => {
  const { username, email, password } = data;

  if (!username || !email || !password) {
    return { error: "Faltan datos (username, email o password)" };
  }

  const ok = addUser(username, email, password);
  if (!ok) {
    return { error: "El usuario o el correo ya existen" };
  }

  return { status: "ok", msg: "Usuario registrado correctamente" };
});

// -------------------------------
// Login
// -------------------------------
subscribePOSTEvent("login", (data) => {
  const { username, password } = data;
  const user = getUser(username);

  if (!user || user.password !== password) {
    return { error: "Credenciales inválidas" };
  }

  const token = generateToken(username);
  return { status: "ok", token };
});

// -------------------------------
// Envío de comando al auto
// -------------------------------
subscribePOSTEvent("sendCommand", (data) => {
  console.log(" Comando recibido:", data.command);
  // Acá iría la lógica para enviar al hardware (por ejemplo Arduino)
  return { status: "ok", executed: data.command };
});

// -------------------------------
// Eventos GET (ping, getUser)
// -------------------------------
subscribeGETEvent("ping", () => {
  return { msg: "pong" };
});

subscribeGETEvent("getUser", (query) => {
  const { username } = query;
  if (!username) return { error: "Falta el username" };

  const user = getUser(username);
  if (!user) return { error: "Usuario no encontrado" };

  return { username: user.username, email: user.email };
});

// -------------------------------
// Real Time Event (datos del auto)
// -------------------------------
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
startServer(4000, true);