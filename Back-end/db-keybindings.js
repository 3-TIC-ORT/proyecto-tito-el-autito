import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

    let conectar = JSON.parse(fs.readFileSync("key.json", "utf-8"));
let usuarios = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "data", "key.json");

async function loadUsuarios() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    usuarios = JSON.parse(data);
  } catch (err) {
    console.error("No se pudo leer usuario.json. Se usará una lista vacía.");
    usuarios = [];
  }
}
await loadUsuarios ();

async function saveUsuarios() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(usuarios, null, 2));
  } catch (err) {
    console.error("Error al guardar usuarios:", err);
  }
}


export async function addUsuario(username, keybindings) {
  const existingUser = usuarios.find(u => u.username === username);

  if (existingUser) {
    // Si ya existe, actualiza los datos
    if (keybindings) existingUser.keybindings = keybindings;
  
    
  } else {
    // Si no existe, crea uno nuevo
    const nuevo = {
      username,
      keybindings
     
    };
    usuarios.push(nuevo);
  }

  await saveUsuarios();
  return true;
  alert(mensaje)
}

// Obtener usuario por nombre
export function getUsuario(username) {
  return usuarios.find(u => u.username === username);
}