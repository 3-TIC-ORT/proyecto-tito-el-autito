import { subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { SerialPort, ReadlineParser } from "serialport";

// ====== CONFIGURACIÓN DEL PUERTO SERIAL ======
const port = new SerialPort({
  path: "COM3", 
  baudRate: 9600, 
});

const parser = new ReadlineParser({ delimiter: "\n" });
port.pipe(parser);

port.on("open", () => {
  console.log(" Puerto serial abierto con Arduino");
});

// ====== MAPA DE COMANDOS ======
const commands = {
  forward: "W",
  backward: "S",
  left: "A",
  right: "D",

};

// ====== ESCUCHAR MENSAJES DESDE EL ARDUINO ======
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

// ====== EVENTO POST: MOVER AUTO ======
subscribePOSTEvent("moverAuto", (data) => {
  const { direccion } = data; 
  console.log(` Movimiento solicitado: ${direccion}`);

  const signal = commands[direccion];
  if (!signal) {
    console.log(" Comando desconocido:", direccion);
    return { status: "Comando no reconocido" };
  }

  // Enviar comando al Arduino
  port.write(signal, (err) => {
    if (err) {
      console.error(" Error al enviar al Arduino:", err.message);
    } else {
      console.log(` Enviado al Arduino: ${signal}`);
    }
  });

  // Notificar al frontend que se procesó el movimiento
  realTimeEvent("movimientoAuto", { direccion });

  return { status: "Movimiento enviado al Arduino" };
});

// ====== INICIO DEL SERVIDOR ======
startServer(3000);
console.log(" Servidor corriendo en puerto 3000");
