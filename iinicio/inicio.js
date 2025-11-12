document.addEventListener("DOMContentLoaded", () => {
  const botonConectar = document.getElementById("conectar");

  botonConectar.addEventListener("click", () => {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      location.reload();
    } else {
      console.log("Usuario iniciado:", usuario);
      window.location.href = "index.html";
    }
  });
});