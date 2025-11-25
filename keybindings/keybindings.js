document.querySelectorAll(".btn-change").forEach(btn => {
  
    btn.addEventListener("click", () => {
      const box = btn.parentElement;                 // la caja donde está el botón
      const input = box.querySelector(".inputKey");  // el input dentro de esa caja
  
      // alternar mostrar / ocultar
      if (input.style.display === "none" || input.style.display === "") {
        input.style.display = "block";
        input.focus();       // opcional
      } else {
        input.style.display = "none";
      }
    });
  
  });