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


// arranca arduino

import { SerialPort, ReadlineParser } from "serialport";

//puerto serial
const port = new SerialPort({
  path: "COM5", 
  baudRate: 9600, 
});

const parser = new ReadlineParser({ delimiter: "\n" });
port.pipe(parser);

port.on("open", () => {
  console.log(" Puerto serial abierto con Arduino");
});


//mensajes desde el arduino
parser.on("data", (data) => {
  const mensaje = data.toString().trim();
  console.log(" Mensaje recibido del Arduino:", mensaje);

  if (mensaje === "COLISION") {
    console.log(" Sensor de choque activado");
    realTimeEvent("sensorChoque", { estado: "impacto detectado" });
  } 
  else {
    realTimeEvent("estadoAuto", { mensaje });
  }
});

const commands = {
  avanzar: "adelante\n",
  retroceder: "atras\n",
  izquierda: "izquierda\n",
  derecha: "derecha\n",
  parar: "parar\n",
};

//mover el auto
subscribePOSTEvent("moverAuto", (data) => {
  const { direccion } = data; 
  console.log(` Movimiento solicitado: ${direccion}`);

  const signal = commands[direccion];
  if (!signal) {
    console.log(" Comando desconocido:", direccion);
    return { status: "Comando no reconocido" };
  }


  port.write(signal, (err) => {
    if (err) {
      console.error(" Error al enviar al Arduino:", err.message);
    } else {
      console.log(` Enviado al Arduino: ${signal}`);
    }
  });

  realTimeEvent("movimientoAuto", { direccion });

  return { status: "Movimiento enviado al Arduino" };
});


startServer(3000, true);
console.log(" Servidor corriendo en puerto 3000");


