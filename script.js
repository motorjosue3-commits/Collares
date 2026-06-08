document.addEventListener('DOMContentLoaded', () => {
  const uiEscaneo = document.getElementById('ui-escaneo');
  const pantallaContenido = document.getElementById('pantalla-contenido');
  const audio = document.getElementById('audio-music');
  const btnMusic = document.getElementById('btn-music');
  const btnEmergencia = document.getElementById('btn-emergencia');
  const seccionPassword = document.getElementById('seccion-password');
  const inputClave = document.getElementById('input-clave');
  const btnVerificar = document.getElementById('btn-verificar');
  const mensajeError = document.getElementById('mensaje-error');
  const lightbox = document.getElementById('lightbox');
  const closeLightbox = document.getElementById('close-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  const target = document.querySelector('a-entity[mindar-image-target="targetIndex: 0"]');
  const scene = document.querySelector('a-scene');

  const setButtonToPlay = () => {
    if (btnMusic) btnMusic.textContent = '🎵 Reproducir';
  };
  const setButtonToPause = () => {
    if (btnMusic) btnMusic.textContent = '⏸️ Pausar';
  };

  const stopMindAR = () => {
    if (!scene) return;

    const mindarComponent = scene.components?.['mindar-image'];
    const mindarSystem = scene.systems?.['mindar-image'];

    if (mindarComponent?.stop) {
      mindarComponent.stop();
      return;
    }
    if (mindarSystem?.stop) {
      mindarSystem.stop();
      return;
    }

    if (typeof scene.pause === 'function') {
      scene.pause();
    }
  };

  const showContent = () => {
    if (uiEscaneo) uiEscaneo.style.display = 'none';
    if (pantallaContenido) pantallaContenido.style.display = 'block';
  };

  const playAudio = async () => {
    if (!audio) return;
    try {
      await audio.play();
      setButtonToPause();
    } catch (err) {
      console.warn('Autoplay blocked or failed:', err);
      setButtonToPlay();
    }
  };

  const activateExperience = async () => {
    showContent();
    await playAudio();
    stopMindAR();
  };

  if (target) {
    target.addEventListener('targetFound', () => {
      activateExperience();
    });
  } else {
    console.warn('No se encontró el elemento <a-entity> con mindar-image-target="targetIndex: 0".');
  }

  if (btnMusic && audio) {
    btnMusic.addEventListener('click', async () => {
      if (audio.paused) {
        try {
          await audio.play();
          setButtonToPause();
        } catch (err) {
          console.warn('Reproducción falló al intentar play():', err);
        }
      } else {
        audio.pause();
        setButtonToPlay();
      }
    });

    audio.addEventListener('play', setButtonToPause);
    audio.addEventListener('playing', setButtonToPause);
    audio.addEventListener('pause', setButtonToPlay);
    audio.addEventListener('ended', setButtonToPlay);
  } else if (btnMusic && !audio) {
    btnMusic.disabled = true;
    btnMusic.setAttribute('aria-disabled', 'true');
    btnMusic.textContent = '🔇 Sin audio';
  }

  if (btnEmergencia && seccionPassword) {
    btnEmergencia.addEventListener('click', () => {
      seccionPassword.style.display = 'block';
      btnEmergencia.style.display = 'none';
      inputClave?.focus();
    });
  }

  const btnLeeme = document.getElementById('btn-leeme');
  const textoLeeme = document.getElementById('texto-leeme');

  if (btnVerificar && inputClave) {
    btnVerificar.addEventListener('click', async () => {
      const clave = inputClave.value.trim().toUpperCase();
      if (clave === 'JM301') {
        mensajeError.textContent = '';
        await activateExperience();
      } else {
        mensajeError.textContent = 'Clave incorrecta. Intenta de nuevo.';
      }
    });
  }

  if (btnLeeme && textoLeeme) {
    btnLeeme.addEventListener('click', () => {
      textoLeeme.classList.toggle('open');
      if (textoLeeme.classList.contains('open')) {
        textoLeeme.style.display = 'block';
        btnLeeme.textContent = '📖 Ocultar lectura';
      } else {
        btnLeeme.textContent = '📖 Léeme';
        setTimeout(() => {
          if (textoLeeme && !textoLeeme.classList.contains('open')) {
            textoLeeme.style.display = 'none';
          }
        }, 400);
      }
    });
  }

  const hideLightbox = () => {
    if (lightbox) lightbox.style.display = 'none';
    if (lightboxImg) lightboxImg.src = '';
  };

  const galleryImages = document.querySelectorAll('#galeria .imagenes img');
  galleryImages.forEach((img) => {
    img.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      }
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', hideLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        hideLightbox();
      }
    });
  }
});
