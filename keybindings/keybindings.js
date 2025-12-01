// -------- BOTONES CAMBIAR --------------------
document.querySelectorAll(".btn-change").forEach(btn => {
  btn.addEventListener("click", () => {
    const box = btn.parentElement;
    const input = box.querySelector(".inputKey");

    // Mostrar input
    btn.style.display = "none";
    input.style.display = "block";
    input.focus();

    const cerrar = () => {
      input.style.display = "none";
      btn.style.display = "block";
      input.removeEventListener("blur", cerrar);
      input.removeEventListener("keydown", enterCheck);
    };

    const enterCheck = (e) => {
      if (e.key === "Enter") {
        cerrar();
      }
    };

    input.addEventListener("blur", cerrar);
    input.addEventListener("keydown", enterCheck);
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

  postEvent("keybinding", data);

  // Tiempo mínimo para que el POST salga
  setTimeout(() => {
    window.location.href = "../jugar/jugar.html";
  }, 100);
}


document.getElementById("guardar").addEventListener("click", mandar);
formulario.addEventListener("submit", mandar);

document.getElementById("btnExit").addEventListener("click", () => {
  window.location.href = "../iinicio/index.html"
})
