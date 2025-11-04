const boton = document.getElementById("btnLogin");

boton.addEventListener("click", () => {
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("contraseña").value.trim();

  if (!usuario || !password) {
    alert("Por favor, completá todos los campos.");
    return;
  }

  soquetic.postEvent("login", { usuario, password }, (respuesta) => {
    alert(respuesta);

    if (respuesta === "Inicio de sesión exitoso.") {
      // Ejemplo: redirigir a otra página
      window.location.href = "index.html";
    }
  });
});