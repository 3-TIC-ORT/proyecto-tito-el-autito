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

 




subscribePOSTEvent("login", (data) => {
  return iniciodesesion(data.username, data.password);
});


subscribePOSTEvent("register", (data) => {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));


  for (let i = 0; i < conectar.length; i++) {
    if (conectar[i].usuario === data.usuario) {
      return "El usuario ya existe";
    }
    else {
      nuevoUsuario = { usuario: data.usuario, contraseña: data.contraseña, email: data.email };
      conectar.push(nuevoUsuario);
    
    
      fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");
    
    
      return "Usuario registrado correctamente";
    }
  }



});


startServer(3000, true);


