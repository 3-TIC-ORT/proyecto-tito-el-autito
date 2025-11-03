import { subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
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

//inicio del servidor


startServer(3000);
console.log(" Servidor corriendo en puerto 3000");
 