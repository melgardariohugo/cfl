document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const panel = this.nextElementSibling;
      const icon = this.querySelector("i");

      // Toggle visibilidad del panel
      panel.classList.toggle("show");

      // Cambiar icono
      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-up");

      // Hacer scroll a la info si el panel está visible
      if (panel.classList.contains("show")) {
        setTimeout(() => {
          panel.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100); // pequeño retraso para asegurar que se muestre primero
      }
    });
  });
});
