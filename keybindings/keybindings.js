// -------- BOTONES CAMBIAR --------------------
document.querySelectorAll(".btn-change").forEach(btn => {
  btn.addEventListener("click", () => {
    const box = btn.parentElement;
    const input = box.querySelector(".inputKey");

    btn.style.display = "none";   
    input.style.display = "block"; 
    input.focus();

    // ENTER → terminar edición
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        input.style.display = "none";
        btn.style.display = "block";
      }
    });

    // Click afuera → terminar edición
    input.addEventListener("blur", () => {
      input.style.display = "none";
      btn.style.display = "block";
    });
  });
});


// --------- CONEXIÓN AL SERVIDOR ------------
connect2Server();


// --------- ENVIAR LOS DATOS -----------------
const formulario = document.getElementById("registroForm");

function mandar(event) {
  event.preventDefault();

  let usuario = document.getElementById("usuario")?.value || "default";
  let avanzar = document.getElementById("up").value;
  let retroceder = document.getElementById("down").value;
  let izquierda = document.getElementById("left").value;
  let derecha = document.getElementById("right").value;

  const data = { usuario, avanzar, retroceder, izquierda, derecha };

  console.log("Mandando al server:", data);

  postEvent("keybinding", data)
    .then(res => console.log("Respuesta del server:", res))
    .catch(err => console.error("ERROR:", err));
}

document.getElementById("guardar").addEventListener("click", mandar);
formulario.addEventListener("submit", mandar);
