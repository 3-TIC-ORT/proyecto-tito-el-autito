import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { SerialPort, ReadlineParser } from "serialport";
 import readline from "readline";
 
subscribePOSTEvent("login", (data) => {
    let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
    let encontro = false;
    let mensaje = "El Usuario no existe.";
    
    console.log (data.usuario);
    console.log (data.password);
    
    for (let i = 0; i < conectar.length; i++) 
    {   
        console.log (conectar[i].usuario);
        if (conectar[i].usuario == data.usuario) 
        {

          console.log ("ENCONTRO USUARIO");
          console.log (conectar[i].contraseña);
          console.log (data.password);
            if (conectar[i].contraseña === data.password) 
            {

              console.log ("El usuario existe"); 
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

// arranca keybinding

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



subscribePOSTEvent("movimiento", (data) => {
    let conectar = JSON.parse(fs.readFileSync("key.json", "utf-8"));
    let encontro = false;
    let mensaje = "ERROR";

    for (let i = 0; i < conectar.length; i++) 
    {   

        if (conectar[i].usuario === data.usuario) 
        {

            if (conectar[i].keybindings.avanzar === data.tecla) 
            {
              console.log ("avanzar"); 
              encontro = true;
              mensaje = "avanzar";
            }
            else if (conectar[i].keybindings.retroceder === data.tecla) 
            {

              console.log ("retroceder"); 
              encontro = true;
              mensaje = "retroceder";
            }  
            else if (conectar[i].keybindings.derecha === data.tecla) 
            {

              console.log ("derecha"); 
              encontro = true;
              mensaje = "derecha";
            } 
            else if (conectar[i].keybindings.izquierda === data.tecla) 
            {

              console.log ("izquierda"); 
              encontro = true;
              mensaje = "izquierda";
            }  
            
        }
    }

    
    if (mensaje)
    {
      console.log(" El mensaje es:", mensaje);
        // ====== CONFIGURACIÓN DEL PUERTO SERIAL ======
        const port = new SerialPort({
          path: "COM3", // Cambiá este valor si tu Arduino está en otro puerto
          baudRate: 9600,
        });
        // ====== LECTOR DE LÍNEAS ======
        const parser = new ReadlineParser();
        port.pipe(parser);

        // ====== EVENTO: CUANDO SE ABRE EL PUERTO ======
        port.on("open", () => {
            // El 'open' es el punto de inicio para toda la lógica de comunicación.

            console.log("✅ Conectado al Arduino en COM5 (9600 baudios)");

            // 1. ENVÍO DE COMANDO INICIAL AUTOMÁTICO (CORREGIDO y DENTRO de "open")
            port.write(mensaje, (err) => {
                if (err) {
                    return console.log('❌ Error al enviar el comando inicial: ', err.message);
                }
                console.log(`➡️ Comando automático enviado: "${mensaje}"`);
            });

            // 2. LECTURA DE MENSAJES DESDE ARDUINO (CORREGIDO: el evento debe ser "data")
            parser.on("data", (data) => {
                console.log(" Mensaje recibido del Arduino:", data.trim());
            });

            // 3. LECTURA DE COMANDOS DESDE LA TERMINAL (DENTRO de "open")
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            // 4. ENVÍO DE DATOS AL ARDUINO POR TECLADO (DENTRO de "open")
            rl.on("line", (input) => {
                port.write(input + "\n", (err) => {
                    if (err) {
                        console.error(" Error al enviar el comando:", err.message);
                    } else {
                        console.log(" Comando enviado al Arduino:", input);
                    }
                });
            });
        });

        port.write(mensaje, (err) => {
            if (err) {
                return console.log('❌ Error al enviar el comando: ', err.message);
            }
            console.log(`➡️ Comando automático enviado: "${mensaje}"`);
        });
        // ====== EVENTO: CUANDO LLEGA UN MENSAJE DESDE ARDUINO ======
        parser.on(mensaje, (data) => {
          console.log(" Mensaje recibido del Arduino:", data.trim());
        });

        // ====== LECTURA DE COMANDOS DESDE LA TERMINAL ======
       
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        // ====== ENVÍO DE DATOS AL ARDUINO ======
        rl.on("line", (input) => {
          port.write(input + "\n", (err) => {
            if (err) {
              console.error(" Error al enviar el comando:", err.message);
            } else {
              console.log(" Comando enviado al Arduino:", input);
            }
          });
        });

        rl.on('close', () => {
            console.log('\nFinalizando aplicación...');
            
            // 1. Iniciar el cierre asíncrono del puerto
            port.close((err) => {
                if (err) {
                    console.error('❌ Error al cerrar el puerto:', err.message);
                }
                console.log(`✅ Puerto ${COM_PORT} cerrado.`);

                // 2. Esperar 500ms (medio segundo) para que el SO lo libere
                console.log("Esperando 500ms para liberar el recurso...");
                setTimeout(() => {
                    console.log("Recurso liberado. Saliendo del proceso.");
                    // 3. Terminar el proceso de Node.js de forma segura
                    process.exit(0); 
                }, 500); // 500 milisegundos de espera
            });
        });
        
    }

    
    return mensaje; 
});






startServer(3000, true);
console.log(" Servidor corriendo en puerto 3000");


