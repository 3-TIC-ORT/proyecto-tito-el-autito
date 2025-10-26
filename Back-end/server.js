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
    // 1. Cargar datos
    let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

    // 2. Bucle para verificar existencia (Si existe, devuelve inmediatamente)
    for (let i = 0; i < conectar.length; i++) {
        if (conectar[i].usuario === data.usuario) {
            return "El usuario ya existe"; // Devuelve un mensaje de error explícito
        }
    }

    // 3. Si el bucle terminó, el usuario es NUEVO. Procedemos a registrar.
    
    // NOTA: Tu JSON guarda 'contraseña', tu cliente envía 'password'. Usamos 'password' para guardar.
    const nuevoUsuario = { 
        usuario: data.usuario, 
        contraseña: data.password, // Mantenemos el nombre de la propiedad 'contraseña' para el JSON
        email: data.email 
    };
    
    // 4. Guardar y devolver éxito
    conectar.push(nuevoUsuario);
    
    // Escribe la nueva lista en el archivo
    fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");
    
    // Esta línea asegura que siempre haya un return si el usuario se registra
    return "Usuario registrado correctamente"; 
});

startServer(3000, true);


