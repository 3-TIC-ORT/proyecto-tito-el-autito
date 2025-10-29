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


