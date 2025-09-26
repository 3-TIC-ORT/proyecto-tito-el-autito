import { subscribePOSTEvent } from "soquetic";
import { getUser } from "./db.js";
import { generateToken } from "./utils.js";

// Evento POST: login
subscribePOSTEvent("login", (data) => {
  const { username, password } = data;

  // 1. Validar que mandaron datos
  if (!username || !password) {
    return { error: "Faltan datos" };
  }

  // 2. Buscar usuario en la "DB"
  const user = getUser(username);
  if (!user) {
    return { error: "Usuario no encontrado" };
  }

  // 3. Verificar contraseña
  if (user.password !== password) {
    return { error: "Contraseña incorrecta" };
  }

  // 4. Generar token (puede ser JWT o un token simple)
  const token = generateToken(username);

  // 5. Responder al frontend
  return { status: "ok", token };
}); 