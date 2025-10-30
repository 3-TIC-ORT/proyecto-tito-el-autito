import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";


let password = fs.readFileSync ("data/usuario.json", "utf-8");
let contraseña = JSON.parse(password);

subscribeGETEvent ( "contraseña", function (){
  return contraseña;
});

let user = fs.readFileSync ("data/usuario", "utf-8");
let usuario = JSON.parse(user);

subscribeGETEvent ( "usuario", function (){
  return usuario;
})

subscribePOSTEvent("register", (data) => {
    let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

    for (let i = 0; i < conectar.length; i++) {
        if (conectar[i].usuario === data.usuario) {
            console.log ("El usuario ya existe"); 
        }
    }
    

    const nuevoUsuario = { 
        usuario: data.usuario, 
        contraseña: data.password, 
        email: data.email 
    };
    
    conectar.push(nuevoUsuario);
    

    fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");
    

    console.log ("Usuario registrado correctamente"); 
});

function keybindings(usuario, keybindings) {
  let conectar = JSON.parse(fs.readFileSync("keybindings-usuarios.json", "utf-8"));
startServer(3000, true);

// arranca keybindings
let user = "";


  for (let i = 0; i < conectar.length; i++) {
    if (conectar[i].usuario === usuario) {
      user = conectar[i];
      break;              
    }
  }



}




subscribePOSTEvent("keybindings", (data) => {
  return keybindings(data.usuario, data.keybindings);
});



subscribePOSTEvent("keybindings", (data) => {
    let conectar = JSON.parse(fs.readFileSync("keybindings-usuarios.json", "utf-8"));

    const user = conectar.find(u => u.username === usuario);

    if (!user) return "Usuario no encontrado";

    // Si no tenía keybindings previos, los crea
    if (!user.keybindings) {
      user.keybindings = {};
    } 
    
    user.keybindings = { ...user.keybindings, ...keybindings };

    const nuevoUsuario = { 
        usuario: data.usuario, 
        password: data.password,
        email: data.email,        
        keybindings : {
          up: "W",
          down: "S",
          left: "A",
          right: "D"
        }
    };
    
    conectar.push(nuevoUsuario);
    

    fs.writeFileSync("./data/keybindings-usuarios.json", JSON.stringify(conectar, null, 2), "utf-8");
    

    return "Usuario registrado correctamente"; 
});
startServer(3000, true);

