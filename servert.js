import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { addUser, getUser } from "./db.js";

// -------------------------------
// Registro
// -------------------------------
subscribePOSTEvent("register", (data) => {
  try {
    const { username, email, password } = data;

    if (!username || !email || !password) {
      return { error: "Faltan datos (username, email o password)" };
    }

    const ok = addUser(username, email, password);
    if (!ok) {
      return { error: "El usuario o el correo ya existen" };
    }

    return { status: "ok", msg: "Usuario registrado correctamente" };
  } catch (err) {
    console.error("Error en register:", err);
    return { error: "Error interno del servidor en register." };
  }
});

// -------------------------------
// Login
// -------------------------------
subscribePOSTEvent("login", (data) => {
  try {
    const { username, password } = data;
    const user = getUser(username);

    if (!user) {
      return { error: "Usuario no encontrado" };
    }
    if (user.password !== password) {
      return { error: "Contraseña incorrecta" };
    }

    return { status: "ok", msg: "Inicio de sesión exitoso" };
  } catch (err) {
    console.error("Error en login:", err);
    return { error: "Error interno del servidor en login." };
  }
});

// -------------------------------
// Envío de comando al auto
// -------------------------------
subscribePOSTEvent("sendCommand", (data) => {
  console.log("Comando recibido:", data.command);
  return { status: "ok", executed: data.command };
});

// -------------------------------
// Eventos GET
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
// Evento en tiempo real
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
console.log(" Servidor Soquetic activo en http://localhost:4000");