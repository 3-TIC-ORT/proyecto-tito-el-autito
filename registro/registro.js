connect2Server();
function iniciarSesion() {
    const usuario = document.getElementById("usuario").value;
    const Email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;

    postEvent("register", { usuario, email:Email, password:contraseña }, (respuesta) => {
        alert(respuesta);
        window.location.href = "../iinicio/index.html";
    })
}
let boton = document.getElementById("btnReg")
    boton.addEventListener("click", iniciarSesion)
    