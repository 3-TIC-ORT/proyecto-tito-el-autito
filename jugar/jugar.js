connect2Server()

document.addEventListener("DOMContentLoaded", () => {

    const usuarioActual = localStorage.getItem("usuario");
    if (!usuarioActual) {
        alert("No hay usuario logueado.");
        return;
    }

    console.log("Usuario activo:", usuarioActual);
    

    let teclaPresionada = null;

    function enviarMovimiento(tecla) {
        postEvent("movimiento", {
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
