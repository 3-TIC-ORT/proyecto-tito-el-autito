/*
import fs from "fs";
import { addUsuario, getUsuario } from "./db.js";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";


function iniciodesesion(usuario, password) {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));


  let user = "";


  for (let i = 0; i < conectar.length; i++) {
    if (conectar[i].usuario === usuario) {
      user = conectar[i];
      break;              
    }
  }


  if (!user) {
    return "El nombre de usuario no existe";
  }


  if (user.password === password) {
    return "Inicio de sesión correcto";
  } else {
    return "Contraseña incorrecta";
  }
}




subscribePOSTEvent("login", (data) => {
  return iniciodesesion(data.usuario, data.password);
});



subscribePOSTEvent("register", (data) => {
    let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

    for (let i = 0; i < conectar.length; i++) {
        if (conectar[i].usuario === data.usuario) {
            return "El usuario ya existe"; 
        }
    }
    

    const nuevoUsuario = { 
        usuario: data.usuario, 
        contraseña: data.password, 
        email: data.email 
    };
    
    conectar.push(nuevoUsuario);
    

    fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");
    

    return "Usuario registrado correctamente"; 
});

startServer(3000, true);

*/
import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";

// ==================
// Función: Iniciar sesión
// ==================
function iniciodesesion(usuario, password) {
  let conectar;

  try {
    conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
  } catch (err) {
    console.error("No se pudo leer usuario.json:", err);
    return "Error al leer la base de datos";
  }

  const user = conectar.find(u => u.usuario === usuario);

  if (!user) return "El nombre de usuario no existe";
  if (user.password === password || user.contraseña === password) {
    return "Inicio de sesión correcto";
  } else {
    return "Contraseña incorrecta";
  }
}

// ==================
// Evento: Login
// ==================
subscribePOSTEvent("login", (data) => {
  return iniciodesesion(data.usuario, data.password);
});

// ==================
// Evento: Registro de usuario
// ==================
subscribePOSTEvent("register", (data) => {
  let conectar;

  try {
    conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
  } catch {
    conectar = [];
  }

  const existe = conectar.some(u => u.usuario === data.usuario);
  if (existe) return "El usuario ya existe";

  const nuevoUsuario = {
    usuario: data.usuario,
    contraseña: data.password,
    email: data.email,
    keybindings: {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight"
    }
  };

  conectar.push(nuevoUsuario);
  fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");

  return "Usuario registrado correctamente";
});

// ==================
// Evento: Guardar keybindings
// ==================
subscribePOSTEvent("guardarKeybindings", (data) => {
  let usuarios;

  try {
    usuarios = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
  } catch {
    usuarios = [];
  }

  const index = usuarios.findIndex(u => u.usuario === data.usuario);

  if (index !== -1) {
    // Actualiza las teclas de un usuario existente
    usuarios[index].keybindings = {
      ...usuarios[index].keybindings,
      ...data.keybindings
    };
  } else {
    // Si no existe, crea un usuario nuevo con esas teclas
    usuarios.push({
      usuario: data.usuario,
      email: data.email,
      password: data.password,
      keybindings: data.keybindings
    });
  }

  fs.writeFileSync("usuario.json", JSON.stringify(usuarios, null, 2), "utf-8");
  return "Keybindings guardados correctamente";
});

// ==================
// Iniciar servidor SoqueTIC
// ==================
startServer(3000, true);
console.log("Servidor SoqueTIC corriendo en http://localhost:3000");
