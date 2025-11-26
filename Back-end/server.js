import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { SerialPort, ReadlineParser } from "serialport";
 import readline from "readline";
 
 // inicio de sesion
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

// registro
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

// keybinding

subscribePOSTEvent("keybinding", (data) => {
  
    let conectar = JSON.parse(fs.readFileSync("key.json", "utf-8"));
    let mensaje = "Keybinding registrado correctamente.";

    // Busca si el ususario existe
    const existingUser = conectar.find(u => u.usuario === data.usuario);
    
    if (existingUser) {
        console.log(`El Keybinding para ${data.usuario} ya existe. Actualizando...`);
        mensaje = "Keybinding actualizado correctamente.";
 
        existingUser.keybindings.avanzar = data.avanzar;
        existingUser.keybindings.retroceder = data.retroceder;
        existingUser.keybindings.derecha = data.derecha;
        existingUser.keybindings.izquierda = data.izquierda;
        
    } else {
        console.log(`Usuario ${data.usuario} nuevo. Creando Keybinding...`);
        
        const nuevoKeybinding = { 
            usuario: data.usuario, 
            keybindings: {
                avanzar: data.avanzar,     
                retroceder: data.retroceder,       
                derecha: data.derecha, 
                izquierda: data.izquierda
            } 
        };
      
        conectar.push(nuevoKeybinding);
    }

    fs.writeFileSync("key.json", JSON.stringify(conectar, null, 2), "utf-8");

    return mensaje; 
});


// arduino
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
        const port = new SerialPort({
          path: "COM3", 
          baudRate: 9600,
        });
        const parser = new ReadlineParser();
        port.pipe(parser);

        port.on("open", () => {

            console.log("Conectado al Arduino en COM3");

            port.write(mensaje, (err) => {
                if (err) {
                    return console.log(' Error al enviar el comando inicial: ', err.message);
                }
                console.log(`Comando automático enviado: "${mensaje}"`);
            });

            parser.on("data", (data) => {
                console.log(" Mensaje recibido del Arduino:", data.trim());
            });

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

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
                return console.log(' Error al enviar el comando: ', err.message);
            }
            console.log(` Comando automático enviado: "${mensaje}"`);
        });
        parser.on(mensaje, (data) => {
          console.log(" Mensaje recibido del Arduino:", data.trim());
        });

       
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

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
            
            port.close((err) => {
                if (err) {
                    console.error(' Error al cerrar el puerto:', err.message);
                }
                console.log(` Puerto ${COM_PORT} cerrado.`);

                console.log("Esperando 500ms para liberar el recurso...");
                setTimeout(() => {
                    console.log("Recurso liberado. Saliendo del proceso.");
                    process.exit(0); 
                }, 500); 
            });
        });
        
    }

    
    return mensaje; 
});

startServer(3000, true);
console.log(" Servidor corriendo en puerto 3000");


