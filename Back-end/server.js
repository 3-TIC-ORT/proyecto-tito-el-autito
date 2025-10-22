import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";


function iniciodesesion(usuario, contraseña) {
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


  if (user.contraseña === contraseña) {
    return "Inicio de sesión correcto";
  } else {
    return "Contraseña incorrecta";
  }
}


function registrarse(usuario, contraseña) {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));


  for (let i = 0; i < conectar.length; i++) {
    if (conectar[i].usuario === usuario) {
      return "El usuario ya existe";
    }
  }


  const nuevoUsuario = { usuario: usuario, contraseña: contraseña };
  conectar.push(nuevoUsuario);


  fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");


  return "Usuario registrado correctamente";
}


console.log(iniciodesesion("olivia", "olivia42"));  
console.log(iniciodesesion("pepe123", "12345"));      
console.log(registrarse("pepe", "pepe!"));      




subscribePOSTEvent("login", (data) => {
  return iniciodesesion(data.usuario, data.contraseña);
});


subscribePOSTEvent("register", (data) => {
  return registrarse(data.usuario, data.contraseña);
});


startServer(3000, true);


