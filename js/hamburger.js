/**
 * ========================================
 * HAMBURGER MENU - Menú Móvil
 * ========================================
 * Funcionalidad para el menú hamburguesa
 * en pantallas pequeñas
 */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menú al hacer click en hamburguesa
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(event) {
        const isClickInsideNav = document.getElementById('navbar').contains(event.target);
        
        if (!isClickInsideNav) {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        }
    });
});
