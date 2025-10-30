import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

const ARCHIVO = "Back-end/keybindings-usuarios.json"; // archivo donde se guardan los datos

// 1) Leer el archivo si existe, o crear un array vacío
let usuarios = [];
let username = [];



try {
  const data = fs.readFileSync(ARCHIVO, "utf-8");
  usuarios = JSON.parse(data);
} catch {
  console.log("No se encontró keybindings-usuarios.json, se creará uno nuevo.");
  usuarios = [];
  
}

// 2) Función para guardar el archivo actualizado
function guardarUsuarios() {
  const json = JSON.stringify(usuarios, null, 2); // 2 espacios para legibilidad
  fs.writeFileSync(ARCHIVO, json);
  console.log("Datos guardados correctamente en", ARCHIVO);
}

// 3) Agregar o actualizar los keybindings de un usuario
export function guardarKeybindings(username, keybindings) {
  const usuario = usuarios.find(u => u.username === username);

  if (usuario) {
    usuario.keybindings = keybindings; // si existe, actualiza
  } else {
    usuarios.push({
      username,
      keybindings : {
      "Arriba" : "W",
        "Abajo" : "S",
        "Izquierda" : "A",
        "Derecha" : "D"

      }
    });
  }

  guardarUsuarios();
}

// 4) Obtener los keybindings de un usuario
export function obtenerKeybindings(username) {
  const usuario = usuarios.find(u => u.username === username);
  return usuario ? usuario.keybindings : null;
}