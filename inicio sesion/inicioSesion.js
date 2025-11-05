connect2Server(3000);
document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");

  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    if (!usuario || !contraseña) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    postEvent("login", { usuario, password: contraseña }, (respuesta) => {
      console.log("Respuesta del servidor:", respuesta);

      if (respuesta === "El usuario existe." || respuesta === "Inicio de sesión exitoso.") {
        alert("¡Bienvenido!");
        window.location.href = "home.html";
      } else {
        alert(respuesta === "Error");
      }
    });
  });
});