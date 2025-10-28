import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo JSON
const DB_PATH = path.join(__dirname, "data", "usuario.json");

// Array en memoria
let usuarios = [];

// Cargar usuarios al iniciar
async function loadUsuarios() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    usuarios = JSON.parse(data);
  } catch (err) {
    console.error("No se pudo leer usuario.json. Se usará una lista vacía.");
    usuarios = [];
  }
}
await loadUsuarios();

// Guardar usuarios en disco
async function saveUsuarios() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(usuarios, null, 2));
  } catch (err) {
    console.error("Error al guardar usuarios:", err);
  }
}

// Exportadas
export async function addUsuario(username, email, password) {
  const exists = usuarios.some(u => u.username === username || u.email === email);
  if (exists) return false;

  const nuevo = { username, email, password };
  usuarios.push(nuevo);
  await saveUsuarios();
  return true;
}

export function getUsuario(username) {
  return usuarios.find(u => u.username === username);
}