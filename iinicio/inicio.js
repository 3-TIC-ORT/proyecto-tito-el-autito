document.addEventListener("DOMContentLoaded", () => {
  const botonConectar = document.getElementById("conectar");

  botonConectar.addEventListener("click", () => {
    const usuario = localStorage.getItem("usuario");

    console.log("usuario actual:", usuario);

    // Si NO estoy logueado
    if (usuario === null || usuario === "null" || usuario === "") {
      console.log("No logueado → ir a iniciar sesión");
      window.location.href = "../inicio sesion/inicioSesion.html";
    } else {
      console.log("Logueado → ir a keybindings");
      window.location.href = "../keybindings/keybindings.html";
    }
  });
});
