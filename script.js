document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const fills = document.querySelectorAll('.bar .fill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevZone = document.getElementById('prevZone');
  const nextZone = document.getElementById('nextZone');

  let currentSlide = 0;
  let isPlaying = true;
  let progress = 0;
  const slideDuration = 6000; // 6 segundos por pantalla
  const intervalStep = 50;

  // Generar brillos dorados aleatorios en el fondo
  const sparklesContainer = document.getElementById('sparkles');
  if (sparklesContainer) {
    for (let i = 0; i < 28; i++) {
      const dot = document.createElement('div');
      dot.classList.add('sparkle');
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.animationDelay = (Math.random() * 4) + 's';
      sparklesContainer.appendChild(dot);
    }
  }

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    currentSlide = index;
    progress = 0;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    fills.forEach((fill, i) => {
      if (i < currentSlide) fill.style.width = '100%';
      else if (i > currentSlide) fill.style.width = '0%';
      else fill.style.width = '0%';
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Temporizador automático
  setInterval(() => {
    if (!isPlaying) return;

    progress += (intervalStep / slideDuration) * 100;
    if (fills[currentSlide]) {
      fills[currentSlide].style.width = Math.min(progress, 100) + '%';
    }

    if (progress >= 100) {
      nextSlide();
    }
  }, intervalStep);

  // Eventos de botones y toques laterales
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (nextZone) nextZone.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (prevZone) prevZone.addEventListener('click', prevSlide);

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playPauseBtn.textContent = isPlaying ? '❚❚' : '▶';
    });
  }

  // Iniciar en la primera diapositiva
  showSlide(0);

  // ================= CONTROL DE MÚSICA SEGURO =================
  const bgMusic = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicBtn');
  let isMusicPlaying = false;

  function toggleMusic() {
    if (!bgMusic) return;
    
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      if (musicBtn) musicBtn.textContent = '🔇';
    } else {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        if (musicBtn) musicBtn.textContent = '🎵';
      }).catch(error => {
        console.log("El navegador bloqueó el audio:", error);
      });
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      toggleMusic();
    });
  }

  // Intenta reproducir al hacer clic en cualquier parte de la pantalla
  document.addEventListener('click', () => {
    if (!isMusicPlaying && bgMusic) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        if (musicBtn) musicBtn.textContent = '🎵';
      }).catch(err => {
        // Silencia el error en consola si el navegador sigue bloqueando
      });
    }
  }, { once: true });

});