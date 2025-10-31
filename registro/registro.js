connect2Server();
function iniciarSesion() {
    const usuario = document.getElementById("usuario").value;
    const Email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;

    postEvent("register", { usuario, email:Email, password:contraseña }, (respuesta) => {
        alert(respuesta);
    })
}
let boton = document.getElementById("submit")
    boton.addEventListener("click", iniciarSesion)