import { subscribePOSTEvent, realTimeEvent, startServer, subscribeGETEvent } from "soquetic";
import { ReadlineParser, SerialPort } from "serialport";
import status from "statuses";
let boton = document.getElementById("boton");

boton.addEventListener("click", responderClickeame);
document.getElementById("button").addEventListener("click", resultado);
const port = new SerialPort({
  path: "COM3",
  baudRate: 9600,
});

const parser = new ReadlineParser();
port.pipe(parser);

port.on("open", () => {
  console.log("Puerto serial abierto");
});

parser.on("data", (data) => {
    const mensaje = data.toString().trim();
    console.log("Mensaje recibido del Arduino", mensaje);
  
    realTimeEvent("estadoAuto", { mensaje });
  });



suscribePOSTEvent ("moverAuto" , (data) => {
    const { direccion } = data;
    console.log ('movimiento solicitado: ${direccion}');
})

realTimeEvent("movimientoAuto" , {direccion});

return { status: "movimiento enviado al arduino"};



startServer(3000);
console.log("servidor en ejecucion (puerto 3000)");