document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".toggle-texto");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const bloque = boton.closest(".especialidad-bloque");
      const texto = bloque.querySelector(".texto-especialidad");
      const estaVisible = texto.classList.contains("visible");

      // Cierra todos los demás
      document.querySelectorAll(".texto-especialidad.visible").forEach((t) => {
        t.style.maxHeight = "0px";
        t.classList.remove("visible");
        t.classList.add("oculto");
      });

      // Si no estaba visible, abrilo y hacé scroll
      if (!estaVisible) {
        texto.classList.remove("oculto");
        texto.classList.add("visible");

        // Set max-height para la animación
        texto.style.maxHeight = texto.scrollHeight + "px";

        // Scroll después de un pequeño delay
        setTimeout(() => {
          texto.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    });
  });
});


  // Efecto aleatorio para las imágenes de la derecha
  const imagenes = document.querySelectorAll(".img-derecha");
  imagenes.forEach((img) => {
    const delay = Math.random() * 5; // entre 0 y 5 segundos
    img.style.animationDelay = `${delay}s`;
    img.classList.add("animada");
  });

