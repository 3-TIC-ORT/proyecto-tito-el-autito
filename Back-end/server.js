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
/*
subscribePOSTEvent("keybinding", (data) => {
    let conectar = JSON.parse(fs.readFileSync("key.json", "utf-8"));
    let encontro = false;
    let mensaje = "Keybinding registrado correctamente.";

    for (let i = 0; i < conectar.length; i++) 
    {
        if (conectar[i].usuario === data.usuario) 
        {
            console.log ("El Keybinding ya existe"); 
            encontro = true;
            mensaje = "El Keybinding ya existe.";
        }
    }
    
    if (encontro)
    {
        console.log ("ENCONTRO"); 
        const existingUser = conectar.find(u => u.usuario === data.usuario);

        if (existingUser) {
            console.log ("Si ya existe, actualiza los datos"); 
            // Si ya existe, actualiza los datos
            
            existingUser.keybindings.arriba = data.arriba;
            existingUser.keybindings.abajo = data.abajo;
            existingUser.keybindings.derecha = data.derecha;
            existingUser.keybindings.izquierda = data.izquierda;

           
        } 
    }
    else
    {
        console.log ("SELSE"); 
        const nuevoKeybinding = { 
            usuario: data.usuario, 
            keybindings: {
                arriba: data.arriba,
                abajo: data.abajo,
                derecha: data.derecha,
                izquierda: data.izquierda
            } 
        };
      
        conectar.push(nuevoKeybinding);
    }

    fs.writeFileSync("key.json", JSON.stringify(conectar, null, 2), "utf-8");


    return mensaje; 
});

*/
subscribePOSTEvent("keybinding", (data) => {
    // Nota: Asumiendo que 'fs' (File System) ya está requerido en este archivo de Node.js.
    // const fs = require('fs'); 
    
    let conectar = JSON.parse(fs.readFileSync("key.json", "utf-8"));
    let mensaje = "Keybinding registrado correctamente.";

    // 1. Buscar si el usuario ya existe
    const existingUser = conectar.find(u => u.usuario === data.usuario);
    
    // 2. Lógica de Actualización o Creación
    if (existingUser) {
        // --- ACTUALIZACIÓN (El usuario ya existe) ---
        console.log(`El Keybinding para ${data.usuario} ya existe. Actualizando...`);
        mensaje = "Keybinding actualizado correctamente.";
        
        // Asignamos los datos de entrada (data.arriba, etc.) directamente a las propiedades
        // del sub-objeto keybindings del usuario existente.
        existingUser.keybindings.avanzar = data.avanzar;
        existingUser.keybindings.retroceder = data.retroceder;
        existingUser.keybindings.derecha = data.derecha;
        existingUser.keybindings.izquierda = data.izquierda;
        
    } else {
        // --- CREACIÓN (El usuario es nuevo) ---
        console.log(`Usuario ${data.usuario} nuevo. Creando Keybinding...`);
        
        const nuevoKeybinding = { 
            usuario: data.usuario, 
            keybindings: {
                // Usamos los nombres 'arriba', 'abajo', etc., para asegurar
                // que la estructura del nuevo registro sea CONSISTENTE.
                avanzar: data.avanzar,     
                retroceder: data.retroceder,       
                derecha: data.derecha, 
                izquierda: data.izquierda
            } 
        };
      
        conectar.push(nuevoKeybinding);
    }

    // 3. Escribir el array actualizado (o con el nuevo usuario) en el archivo
    fs.writeFileSync("key.json", JSON.stringify(conectar, null, 2), "utf-8");

    // 4. Devolver un mensaje al cliente
    return mensaje; 
});



startServer(3000, true);

