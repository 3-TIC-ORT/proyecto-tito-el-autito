import fs from "fs";

// 📁 Ruta del archivo donde se guardan los usuarios
const DB_PATH = "./data/users.json";

// 🧠 Cargamos los usuarios al iniciar
let users = [];
try {
  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH, "utf8");
    users = JSON.parse(data);
  } else {
    users = [];
  }
} catch (err) {
  console.error("⚠️ Error al leer la base de datos:", err);
  users = [];
}

// 💾 Función para guardar los cambios en el archivo
function saveDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

// ➕ Registrar usuario
export function addUser(username, email, password) {
  // Verificamos si ya existe el username o el email
  if (users.find(u => u.username === username || u.email === email)) {
    return false;
  }

  const newUser = { username, email, password };
  users.push(newUser);
  saveDB();
  return true;
}

// 🔍 Buscar usuario por nombre
export function getUser(username) {
  return users.find(u => u.username === username);
}

// 📋 Listar todos los usuarios (útil para debug)
export function getAllUsers() {
  return users;
}

// ❌ Eliminar un usuario
export function deleteUser(username) {
  const index = users.findIndex(u => u.username === username);
  if (index === -1) return false;

  users.splice(index, 1);
  saveDB();
  return true;
}

// ✏️ Actualizar datos de un usuario
export function updateUser(username, newData) {
  const user = getUser(username);
  if (!user) return false;

  Object.assign(user, newData);
  saveDB();
  return true;
}
