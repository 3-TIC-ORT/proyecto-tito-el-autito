/*
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "data", "keybindings-lock.json");

let usuarios = []

async function loadUsuarios() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    usuarios = JSON.parse(data);
  } catch (err) {
    console.error("");
    usuarios = [];
  }
}
await loadUsuarios ();
async function saveUsuarios() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(usuarios, null, 2));
  } catch (error) {
    console.error("Error al guardar usuarios:", error);
  }
}

  const existingUser = usuarios.find(u => u.username === username);

  if (existingUser) {
    // Si ya existe, actualiza los datos
    if (email) existingUser.email = email;
    if (password) existingUser.password = password;
    if (keybindings) existingUser.keybindings = keybindings;
    
  } else {
    // Si no existe, crea uno nuevo
    const nuevo = {
      username,
      email,
      password,
      keybindings : {
        up: "W",
        down: "S",
        left: "A",
        right: "D"
      }
    }; 
     
    };
    usuarios.push(nuevo);
  

  await saveUsuarios();
  return true;

// Obtener usuario por nombre
export function getUsuario(username) {
  return usuarios.find(u => u.username === username);
}
  */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Obtener ruta absoluta del archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "data", "keybindings-usuarios.json"); // nombre correcto

let usuarios = [];

// ===============================
// CARGAR USUARIOS AL INICIAR
// ===============================
async function loadUsuarios() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    usuarios = JSON.parse(data);
  } catch (err) {
    console.error("No se pudo leer keybindings-usuarios.json. Se usará una lista vacía.");
    usuarios = [];
  }
}
await loadUsuarios();

// ===============================
// GUARDAR USUARIOS
// ===============================
async function saveUsuarios() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(usuarios, null, 2));
  } catch (error) {
    console.error("Error al guardar usuarios:", error);
  }
}

// ===============================
// AGREGAR O ACTUALIZAR USUARIO
// ===============================
export async function addOrUpdateUsuario(username, email, password, keybindings) {
  let existingUser = usuarios.find(u => u.username === username);

  if (existingUser) {
    if (email) existingUser.email = email;
    if (password) existingUser.password = password;
    if (keybindings) existingUser.keybindings = keybindings;
  } else {
    const nuevo = {
      username,
      email,
      password,
      keybindings: keybindings || {
        up: "W",
        down: "S",
        left: "A",
        right: "D"
      }
    };
    usuarios.push(nuevo);
  }

  await saveUsuarios();
  return true;
}

// ===============================
// OBTENER USUARIO POR NOMBRE
// ===============================
export function getUsuario(username) {
  return usuarios.find(u => u.username === username);
}