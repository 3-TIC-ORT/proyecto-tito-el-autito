import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo JSON
const DB_PATH = path.join(__dirname, 'data', 'usuario.json');

// Arreglo de usuarios en memoria
let usuario = [];

// Cargar usuarios desde el archivo al iniciar
async function loadUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    usuario = JSON.parse(data);
  } catch (err) {
    console.error('No se pudo leer el archivo de usuarios. Se usará una lista vacía.');
    usuario = [];
  }
}
await loadUsers(); // Ejecutar al cargar el módulo

// Guardar usuarios en el archivo
async function saveUsuario() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(usuario, null, 2));
  } catch (err) {
    console.error('Error al guardar usuarios:', err);
  }
}

// Funciones exportadas
export async function addUsuario(username, email, password) {
  const exists = usuario.some(u => u.username === username || u.email === email);
  if (exists) return false;

  const newUsuario = { username, email, password };
  usuario.push(newUsuario);
  await saveUsers();
  return true;
}

export function getUsuario(usuario) {
  return users.find(u => u.username === username);
}

export function getAllUsuario() {
  return usuario;
}

export async function deleteUser(username) {
  const index = usuario.findIndex(u => u.username === username);
  if (index === -1) return false;

  users.splice(index, 1);
  await saveUsuario();
  return true;
}

export async function updateUsuario(username, newData) {
  const usuarios = getUsuario(username);
  if (!usuario) return false;

  Object.assign(usuario, newData);
  await saveUsuario();
  return true;
}