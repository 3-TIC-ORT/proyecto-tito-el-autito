import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";


subscribePOSTEvent("login", (data) => {
    let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
    let encontro = false;
    let mensaje = "El Usuario no existe.";

    for (let i = 0; i < conectar.length; i++) 
    {   
        if (conectar[i].usuario == data.usuario) 
        {
            if (conectar[i].password == data.password) 
            {

              console.log ("El usuario ya existe"); 
              encontro = true;
              mensaje = "El usuario existe.";
            }   
            
        }
    }

    return mensaje; 
});

subscribePOSTEvent("register", (data) => {
    let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
    let encontro = false;
    let mensaje = "Usuario registrado correctamente.";

    for (let i = 0; i < conectar.length; i++) 
    {
        if (conectar[i].usuario === data.usuario) 
        {
            console.log ("El usuario ya existe"); 
            encontro = true;
            mensaje = "El usuario ya existe.";
        }
    }
    
    if (!encontro)
    {
        const nuevoUsuario = { 
            usuario: data.usuario, 
            contraseña: data.password, 
            email: data.email 
        };
      
        conectar.push(nuevoUsuario);
    }

    fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");


    return mensaje; 
});






startServer(3000, true);

