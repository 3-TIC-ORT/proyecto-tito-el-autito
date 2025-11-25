document.querySelectorAll(".btn-change").forEach(btn => {
    btn.addEventListener("click", () => {
      const box = btn.parentElement;
      const input = box.querySelector(".inputKey");
  
      btn.style.display = "none";   // oculto botón
      input.style.display = "block"; // muestro input
      input.focus();
  
      // Cuando toca ENTER → cerrar y volver al botón
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          input.style.display = "none";
          btn.style.display = "block";
        }
      });
  
      // Si hace click afuera del input → cerrar
      input.addEventListener("blur", () => {
        input.style.display = "none";
        btn.style.display = "block";
      });
    });
  });
  