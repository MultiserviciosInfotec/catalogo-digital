/**
 * ========================================
 * CAROUSEL.JS - Control del Carrusel
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const slideCount = slides.length;

    // Crear dots indicadores
    function createDots() {
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Ir a una slide específica
    function goToSlide(n) {
        currentSlide = n;
        updateCarousel();
    }

    // Siguiente slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    }

    // Slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
    }

    // Actualizar posición del carrusel
    function updateCarousel() {
        const offset = -currentSlide * 100;
        
        // Usar la transición del CSS (0.8s suave)
        track.style.transform = `translateX(${offset}%)`;

        // Actualizar dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Autoplay
    let autoplayInterval;
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 6000);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    // Pausar autoplay al interactuar
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Pausar al pasar el mouse
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    }

    // Crear dots y inicializar
    createDots();
    updateCarousel();

    // Iniciar autoplay
    startAutoplay();

    // Soporte para teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        }
    });
});
