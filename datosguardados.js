import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo JSON
const DB_PATH = path.join(__dirname, 'data', 'users.json');

// Arreglo de usuarios en memoria
let users = [];

// Cargar usuarios desde el archivo al iniciar
async function loadUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    console.error('No se pudo leer el archivo de usuarios. Se usará una lista vacía.');
    users = [];
  }
}
await loadUsers(); // Ejecutar al cargar el módulo

// Guardar usuarios en el archivo
async function saveUsers() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error al guardar usuarios:', err);
  }
}

// Funciones exportadas
export async function addUser(username, email, password) {
  const exists = users.some(u => u.username === username || u.email === email);
  if (exists) return false;

  const newUser = { username, email, password };
  users.push(newUser);
  await saveUsers();
  return true;
}

export function getUser(username) {
  return users.find(u => u.username === username);
}

export function getAllUsers() {
  return users;
}

export async function deleteUser(username) {
  const index = users.findIndex(u => u.username === username);
  if (index === -1) return false;

  users.splice(index, 1);
  await saveUsers();
  return true;
}

export async function updateUser(username, newData) {
  const user = getUser(username);
  if (!user) return false;

  Object.assign(user, newData);
  await saveUsers();
  return true;
}