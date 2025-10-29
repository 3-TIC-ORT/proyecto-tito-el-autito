connect2Server();


function iniciarSesion() {
    const usuario = document.getElementById("usuario").value;
    const Email = document.getElementById("Email").value;
    const contraseña = document.getElementById("contraseña").value;

    postEvent("register", { usuario, Email, contraseña }, (respuesta) => {
        alert(respuesta);
    });
