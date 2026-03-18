/**
 * ========================================
 * ANIMATIONS - Animaciones Generales
 * ========================================
 * 
 * Gestiona:
 * - Animaciones de entrada con Intersection Observer
 * - Scroll suave a secciones
 * - Efectos de transición
 */

// ========== SMOOTH SCROLL ==========
// Desplazamiento suave a secciones del sitio
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== INTERSECTION OBSERVER ==========
// Anima elementos cuando se hacen visibles en pantalla
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos que deben animarse
document.querySelectorAll('.product-card, .advantage-item, .footer-section').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ========== DEFINIR ANIMACIONES CSS ==========
// Agregar estilos de animación dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
