document.addEventListener("DOMContentLoaded", () => {
  const botonConectar = document.getElementById("conectar");

  botonConectar.addEventListener("click", () => {
    const usuario = localStorage.getItem("usuario");

    if (usuario != "null") {
      window.location.href = "../inicio sesion/inicioSesion.html";
    } else {
      console.log("Usuario iniciado:", usuario);
      window.location.href = "../keybindings/keybindings.html";
    }
  });
});