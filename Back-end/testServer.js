// testSerial.js
import { SerialPort, ReadlineParser } from "serialport";

// ====== CONFIGURACIÓN DEL PUERTO SERIAL ======
const port = new SerialPort({
  path: "COM5", // Cambiá este valor si tu Arduino está en otro puerto
  baudRate: 9600,
});

// ====== LECTOR DE LÍNEAS ======
const parser = new ReadlineParser();
port.pipe(parser);

// ====== EVENTO: CUANDO SE ABRE EL PUERTO ======
port.on("open", () => {
  console.log(" Conectado al Arduino en COM5 (9600 baudios)");
  console.log("Escribí un comando y presioná Enter (ej: adelante, atras, parar)");
});

// ====== EVENTO: CUANDO LLEGA UN MENSAJE DESDE ARDUINO ======
parser.on("data", (data) => {
  console.log(" Mensaje recibido del Arduino:", data.trim());
});

// ====== LECTURA DE COMANDOS DESDE LA TERMINAL ======
import readline from "readline";
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