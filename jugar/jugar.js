document.addEventListener("DOMContentLoaded", () => {

    const usuarioActual = localStorage.getItem("usuario");
    if (!usuarioActual) {
        alert("No hay usuario logueado.");
        return;
    }

    console.log("Usuario activo:", usuarioActual);
    

    cliente.connect2Server()


    let teclaPresionada = null;

    function enviarMovimiento(tecla) {
        cliente.postEvent("movimiento", {
            usuario: usuarioActual,
            tecla: tecla
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === teclaPresionada) return;
        teclaPresionada = e.key;
        console.log("🔥 Tecla presionada:", e.key);
        enviarMovimiento(e.key);
    });

    document.addEventListener("keyup", () => {
        teclaPresionada = null;
        console.log("🛑 Tecla soltada → STOP");
        enviarMovimiento("stop");
    });
});
