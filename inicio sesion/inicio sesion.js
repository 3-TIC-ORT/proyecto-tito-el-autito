document.getElementById("btnLogin").addEventListener("click", (e) => {
  e.preventDefault(); // evita que se recargue la página

  const usuario = document.getElementById("usuario").value.trim();
  const contraseña = document.getElementById("contraseña").value.trim();

  if (!usuario || !contraseña) {
    alert("Por favor, completá todos los campos.");
    return;
  }

  // 👇 mandamos "password" al back, porque el back usa data.password
  soquetic.postEvent("login", { usuario, password: contraseña }, (respuesta) => {
    if (respuesta === "El usuario existe." || respuesta === "Inicio de sesión exitoso.") {
      alert("¡Bienvenido!");
      window.location.href = "home.html";
    } else {
      alert("❌ " + respuesta);
    }
  });
});