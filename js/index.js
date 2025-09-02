/* ================================
   Menú lateral: abrir/cerrar + accesibilidad
   ================================ */
// frontend/js/index.js (fragmento)
const menuToggle = document.getElementById("menuToggle");
const sideMenu   = document.getElementById("sideMenu");

if (menuToggle && sideMenu) {
  const toggleMenu = () => {
    const isOpen = sideMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };
  menuToggle.addEventListener("click", toggleMenu);

  // Cerrar al hacer click fuera
  document.addEventListener("click", (e) => {
    const clickOutside = !sideMenu.contains(e.target) && !menuToggle.contains(e.target);
    if (clickOutside && sideMenu.classList.contains("active")) toggleMenu();
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sideMenu.classList.contains("active")) toggleMenu();
  });
}


/* ================================
   Logo video: 
   pedir 1 clic para habilitar sonido; luego 1 clic para silenciar.
   ================================ */
document.addEventListener("DOMContentLoaded", () => {
  const v = document.getElementById("logoVideo");
  if (!v) return;

  // Estado: 'playing' (con sonido), 'muted' (silencio), 'blocked' (autoplay con sonido bloqueado)
  let state = 'blocked'; // asumimos bloqueado hasta probar

  // UI mínima opcional para informar bloqueo
  let hint;
  const showHint = (text) => {
    if (hint) return;
    hint = document.createElement('div');
    hint.textContent = text;
    hint.style.cssText = `
      position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%);
      background: rgba(0,0,0,.75); color: #fff; padding: 8px 12px; border-radius: 20px;
      font-size: 13px; z-index: 9999; box-shadow: 0 6px 14px rgba(0,0,0,.2);
    `;
    document.body.appendChild(hint);
    setTimeout(()=>{ hint?.remove(); hint=null; }, 3000);
  };

  // Intentar arrancar con sonido
  v.removeAttribute('muted');
  v.muted = false;
  v.autoplay = true;
  v.playsInline = true;

  const tryPlayWithSound = () =>
    v.play().then(() => { state = 'playing'; }).catch(() => { state = 'blocked'; });

  const tryStart = async () => {
    await tryPlayWithSound();
    if (state === 'blocked') {
      // No se pudo con sonido: arrancamos mudo para que al menos se reproduzca
      v.muted = true;
      v.setAttribute('muted', '');
      try { await v.play(); } catch(e) { /* ignore */ }
      showHint('🔈 Toca una vez para activar el sonido');
    }
  };

  tryStart();

  // Gestión de clics global
  const onClick = async () => {
    if (state === 'playing') {
      // Primer clic luego de sonar → silenciar
      v.muted = true;
      v.setAttribute('muted','');
      state = 'muted';
      showHint('🔇 Sonido desactivado');
      return;
    }

    if (state === 'blocked') {
      // Primer clic necesario para habilitar sonido
      v.muted = false;
      v.removeAttribute('muted');
      try {
        await v.play();
        state = 'playing';
        showHint('🔊 Sonido activado (clic de nuevo para silenciar)');
      } catch (e) {
        // Si aún falla, mantenemos mudo
        v.muted = true;
        v.setAttribute('muted','');
        state = 'muted';
        showHint('⚠️ No se pudo activar sonido');
      }
      return;
    }

    if (state === 'muted') {
      // Si estaba en mute y quieres permitir volver a activar con otro clic, descomenta:
      // v.muted = false; v.removeAttribute('muted'); await v.play(); state = 'playing';
      // showHint('🔊 Sonido activado');
    }
  };

  document.addEventListener('click', onClick);
});

/* ================================
   Carrusel por fundido (fade) con JS: loop infinito
   ================================ */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const videoRight = document.getElementById("carouselVideo");
  if (!track || !videoRight) return;

  const slides = Array.from(track.querySelectorAll("img"));
  const n = slides.length;

  const transitionEffects = [
    "fade",
    "slide-left",
    "slide-right",
    "zoom-in",
    "zoom-out"
  ];

  const applyRandomEffect = (img) => {
    img.classList.remove("fade", "slide-left", "slide-right", "zoom-in", "zoom-out");
    const effect = transitionEffects[Math.floor(Math.random() * transitionEffects.length)];
    img.classList.add(effect);
  };

  const perSlide = 15;
  let idx = 0;
  let timer;

  const show = (i) => {
    slides.forEach((img, j) => {
      img.classList.toggle("active", j === i);
      if (j === i) applyRandomEffect(img);
    });
    syncVideoWithImage(slides[i]);
  };

  const syncVideoWithImage = (img) => {
    const src = img.getAttribute("src");
    if (!src) return;

    const baseName = src.split('/').pop().replace('.png', '');
    const videoPath = `frontend/imagen/carrousel/${baseName}.mp4`;

    const source = videoRight.querySelector("source");
    if (source.getAttribute("src") === videoPath) return;

    videoRight.pause();
    videoRight.currentTime = 0;
    source.setAttribute("src", videoPath);
    videoRight.load();

    videoRight.play().catch(err => {
      console.warn("❗No se pudo reproducir el video:", videoPath, err);
    });
  };

  const startLoop = () => {
    show(idx);
    clearInterval(timer);
    timer = setInterval(() => {
      idx = (idx + 1) % n;
      show(idx);
    }, perSlide * 1000);
  };

  let loaded = 0;
  slides.forEach(img => {
    if (img.complete) {
      loaded++;
    } else {
      img.addEventListener("load", () => {
        loaded++;
        if (loaded === n) startLoop();
      }, { once: true });
      img.addEventListener("error", () => {
        loaded++;
        if (loaded === n) startLoop();
      }, { once: true });
    }
  });

  if (loaded === n) startLoop();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      startLoop();
    }
  });
});

/* ================================
   Banner: texto tipo marquee (sin <marquee>)
   ================================ */
document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.querySelector(".banner-marquee");
  if (!marquee) return;

  const text = marquee.textContent.trim();
  if (!text) return;

  // Duplicamos el contenido para scroll continuo
  marquee.innerHTML = `<span>${text}</span><span>${text}</span>`;
  marquee.classList.add("anim");
});

/* ================================
   Banner: mostrar contenedor de imágenes SOLO si hay <img>
   ================================ */
document.addEventListener("DOMContentLoaded", () => {
  const bannerImages = document.getElementById("bannerImages");
  if (!bannerImages) return;
  const imgs = bannerImages.querySelectorAll("img");
  bannerImages.style.display = imgs.length > 0 ? "flex" : "none";
});

/* ================================
   video izquierdo
   ================================ */
document.addEventListener("DOMContentLoaded", () => {
  const fallback = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
      <rect width='100%' height='100%' fill='#eef2f7'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Arial' font-size='22' fill='#667085'>
        Imagen no encontrada
      </text>
    </svg>
  `);

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      console.warn("[IMG 404]", img.src);
      img.src = fallback;
      img.style.objectFit = "contain";
      img.style.background = "#fff";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const videoIzq = document.querySelector(".video-lateral-izq video");
  const toggleBtn = document.querySelector(".video-lateral-izq .video-toggle-btn");
  const icon = toggleBtn?.querySelector("i");

  if (!videoIzq || !toggleBtn || !icon) return;

  let isPlaying = false;

  // Inicialmente, nos aseguramos de que esté detenido y al inicio
  videoIzq.pause();
  videoIzq.currentTime = 0;
  videoIzq.muted = false; // sonido activado desde el principio

  toggleBtn.addEventListener("click", () => {
    if (!isPlaying) {
      videoIzq.currentTime = 0; // siempre desde el inicio
      videoIzq.play();
      icon.classList.remove("fa-volume-mute");
      icon.classList.add("fa-volume-up");
      isPlaying = true;
    } else {
      videoIzq.pause();
      videoIzq.currentTime = 0;
      icon.classList.remove("fa-volume-up");
      icon.classList.add("fa-volume-mute");
      isPlaying = false;
    }
  });

  // Cuando el video termina naturalmente, lo marcamos como "no reproduciendo"
  videoIzq.addEventListener("ended", () => {
    isPlaying = false;
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-mute");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const bannerImgs = document.querySelectorAll(".banner-images img");
  if (!bannerImgs.length) return;

  bannerImgs.forEach((img) => {
    const randomDelay = (Math.random() * 6).toFixed(2); // entre 0 y 6 seg
    img.style.animationDelay = `${randomDelay}s`;
  });
});
