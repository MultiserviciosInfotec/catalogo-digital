/**
 * ========================================
 * CARRUSELES.JS - Carruseles por Categoría
 * ========================================
 */

let allProducts = [];
let categoriesData = {};

document.addEventListener('DOMContentLoaded', function () {
    // Obtener todos los productos originales
    const originalProducts = Array.from(document.querySelectorAll('.product-card'));
    allProducts = originalProducts.map(card => ({
        element: card.cloneNode(true),
        category: card.dataset.category,
        id: card.dataset.id,
        name: card.querySelector('.product-name')?.textContent || '',
    }));

    // Organizar productos por categoría
    const uniqueCategories = ['accesorios', 'suministros', 'impresoras', 'monitores', 'laptops'];
    
    uniqueCategories.forEach(category => {
        categoriesData[category] = allProducts.filter(p => p.category === category);
    });

    // Generar carruseles
    generateCarrusels();

    // Búsqueda global
    setupSearch();

    // Categorías
    setupCategories();
});

// ========== GENERAR CARRUSELES ==========
function generateCarrusels() {
    const container = document.getElementById('carruselesContainer');
    container.innerHTML = '';

    const categoryInfo = {
        accesorios: { icon: 'fa-plug', label: 'Accesorios' },
        suministros: { icon: 'fa-droplet', label: 'Suministros' },
        impresoras: { icon: 'fa-print', label: 'Impresoras' },
        monitores: { icon: 'fa-desktop', label: 'Monitores' },
        laptops: { icon: 'fa-laptop', label: 'Laptops' },
    };

    Object.keys(categoryInfo).forEach(category => {
        const products = categoriesData[category];
        if (products.length === 0) return;

        const info = categoryInfo[category];
        const section = document.createElement('div');
        section.className = 'carrusel-section';
        section.innerHTML = `
            <div class="carrusel-header">
                <div class="carrusel-icon">
                    <i class="fas ${info.icon}"></i>
                </div>
                <h3 class="carrusel-title">${info.label}</h3>
            </div>
            <div class="carrusel-wrapper">
                <button class="carrusel-nav carrusel-nav-prev" data-category="${category}">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="carrusel-track" id="track-${category}">
                    ${products.map(p => createProductHTML(p, category)).join('')}
                </div>
                <button class="carrusel-nav carrusel-nav-next" data-category="${category}">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="carrusel-indicators" id="indicators-${category}"></div>
        `;

        container.appendChild(section);
        setupCarruselNavigation(category, products.length);
        setupIndicators(category, products.length);
    });
}

// ========== HTML DEL PRODUCTO EN CARRUSEL ==========
function createProductHTML(product, category) {
    const card = product.element;
    const name = card.querySelector('.product-name')?.textContent || '';
    const price = card.querySelector('.price')?.textContent || '';
    const brand = card.querySelector('.brand')?.textContent || '';
    const image = card.querySelector('img')?.src || '';
    const discount = card.querySelector('.discount-badge')?.textContent || '';
    const id = card.dataset.id;

    return `
        <div class="carrusel-item">
            <div class="carrusel-product" onclick="showProductModal('${id}')">
                <div class="carrusel-product-img">
                    <img src="${image}" alt="${name}">
                    ${discount ? `<div class="carrusel-discount">${discount}</div>` : ''}
                </div>
                <div class="carrusel-product-info">
                    <p class="carrusel-store">Por tienda Infotec</p>
                    ${brand ? `<p class="carrusel-brand">${brand}</p>` : ''}
                    <h4 class="carrusel-name">${name}</h4>
                    <p class="carrusel-price">${price}</p>
                    <button class="carrusel-btn">Ver detalles</button>
                </div>
            </div>
        </div>
    `;
}

// ========== NAVEGACIÓN DE CARRUSELES ==========
function setupCarruselNavigation(category, productCount) {
    const track = document.getElementById(`track-${category}`);
    const prevBtn = document.querySelector(`.carrusel-nav-prev[data-category="${category}"]`);
    const nextBtn = document.querySelector(`.carrusel-nav-next[data-category="${category}"]`);

    const itemWidth = track.querySelector('.carrusel-item').offsetWidth + 24; // 24px gap
    let currentPosition = 0;
    const maxScroll = itemWidth * productCount - track.offsetWidth;

    prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(0, currentPosition - itemWidth);
        track.style.transform = `translateX(-${currentPosition}px)`;
        updateNavigationButtons();
        updateIndicators(category);
    });

    nextBtn.addEventListener('click', () => {
        currentPosition = Math.min(maxScroll, currentPosition + itemWidth);
        track.style.transform = `translateX(-${currentPosition}px)`;
        updateNavigationButtons();
        updateIndicators(category);
    });

    function updateNavigationButtons() {
        prevBtn.disabled = currentPosition === 0;
        nextBtn.disabled = currentPosition >= maxScroll;
    }

    updateNavigationButtons();
}

// ========== INDICADORES DE POSICIÓN ==========
function setupIndicators(category, productCount) {
    const container = document.getElementById(`indicators-${category}`);
    const pages = Math.ceil(productCount / 5);

    for (let i = 0; i < pages; i++) {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => {
            const track = document.getElementById(`track-${category}`);
            const itemWidth = track.querySelector('.carrusel-item').offsetWidth + 24;
            const newPosition = itemWidth * i * 5;
            track.style.transform = `translateX(-${newPosition}px)`;
            updateAllIndicators(category);
        });
        container.appendChild(indicator);
    }
}

function updateIndicators(category) {
    const track = document.getElementById(`track-${category}`);
    const scrollPosition = Math.abs(parseInt(track.style.transform.match(/-?\d+/)[0]) || 0);
    const itemWidth = track.querySelector('.carrusel-item').offsetWidth + 24;
    const currentPage = Math.round(scrollPosition / (itemWidth * 5));

    updateAllIndicators(category, currentPage);
}

function updateAllIndicators(category, page = 0) {
    document.querySelectorAll(`#indicators-${category} .indicator`).forEach((ind, idx) => {
        ind.classList.toggle('active', idx === page);
    });
}

// ========== BÚSQUEDA GLOBAL ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const carruselesContainer = document.getElementById('carruselesContainer');

    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();

        if (query === '') {
            // Mostrar carruseles
            carruselesContainer.style.display = 'flex';
            searchResults.style.display = 'none';
        } else {
            // Buscar productos
            const results = allProducts.filter(p =>
                p.name.toLowerCase().includes(query)
            );

            if (results.length > 0) {
                searchResults.innerHTML = results.map(p => {
                    const card = p.element;
                    return card.outerHTML;
                }).join('');
                searchResults.style.display = 'grid';
                carruselesContainer.style.display = 'none';
                attachDetailsListeners();
            } else {
                searchResults.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 20px; display: block;"></i>
                        <h3 style="color: #333; margin-bottom: 10px;">No se encontraron productos</h3>
                        <p style="color: #999;">Intenta con otra búsqueda</p>
                    </div>
                `;
                searchResults.style.display = 'grid';
                carruselesContainer.style.display = 'none';
            }
        }
    });
}

// ========== CATEGORÍAS ==========
function setupCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const searchInput = document.getElementById('searchInput');
            searchInput.value = '';

            document.getElementById('searchResults').style.display = 'none';
            document.getElementById('carruselesContainer').style.display = 'flex';

            if (filter === 'all') {
                document.querySelectorAll('.carrusel-section').forEach(s => s.style.display = 'block');
            } else {
                document.querySelectorAll('.carrusel-section').forEach(s => {
                    s.style.display = s.querySelector('.carrusel-icon i').className.includes(getIconForCategory(filter)) ? 'block' : 'none';
                });
            }
        });
    });

    document.querySelector('[data-filter="all"]').classList.add('active');
}

function getIconForCategory(category) {
    const icons = {
        accesorios: 'fa-plug',
        suministros: 'fa-droplet',
        impresoras: 'fa-print',
        monitores: 'fa-desktop',
        laptops: 'fa-laptop',
    };
    return icons[category] || '';
}

// ========== MODAL DE DETALLES ==========
function showProductModal(productId) {
    const originalCard = document.querySelector(`[data-id="${productId}"]`);
    if (!originalCard) return;

    const name = originalCard.querySelector('.product-name').textContent;
    const price = originalCard.querySelector('.price').textContent;
    const description = originalCard.querySelector('.product-description')?.textContent || 'Sin descripción';
    const image = originalCard.querySelector('img').src;
    const brand = originalCard.querySelector('.brand')?.textContent || '';
    const discount = originalCard.querySelector('.discount-badge')?.textContent || '';
    const additionalImages = originalCard.dataset.images ? originalCard.dataset.images.split('|') : [];

    let images = [image, ...additionalImages].filter(Boolean).slice(0, 4);

    const modal = document.createElement('div');
    modal.setAttribute('data-modal', 'true');
    modal.style.cssText = `
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2000;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    // Galería HTML
    let galleryHTML = '';
    let imageContainerHTML = '';

    if (images.length > 1) {
        galleryHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px; flex-shrink: 0;">
                ${images.map((img, idx) => `
                    <img src="${img}" alt="Imagen ${idx + 1}" 
                         class="gallery-thumb"
                         style="width: 80px; height: 80px; object-fit: scale-down; background: #f9f9f9; border-radius: 6px; cursor: pointer; border: 3px solid ${idx === 0 ? '#0066CC' : 'transparent'}; transition: all 0.3s;"
                         data-index="${idx}">
                `).join('')}
            </div>
        `;

        imageContainerHTML = `
            <div style="display: flex; gap: 20px; margin-bottom: 20px; align-items: flex-start;">
                ${galleryHTML}
                <img id="mainProductImage" src="${images[0]}" alt="${name}" 
                     style="flex: 1; height: 350px; object-fit: scale-down; background: #f9f9f9; border-radius: 8px;">
            </div>
        `;
    } else {
        imageContainerHTML = `
            <div style="margin-bottom: 20px;">
                <img id="mainProductImage" src="${images[0]}" alt="${name}" 
                     style="width: 100%; height: 350px; object-fit: scale-down; background: #f9f9f9; border-radius: 8px;">
            </div>
        `;
    }

    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; max-width: 900px; width: 100%; position: relative; max-height: 90vh; overflow-y: auto;">
            <button onclick="this.closest('[data-modal]').remove()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; color: #666;">&times;</button>
            
            ${imageContainerHTML}
            ${discount ? `<div style="position: absolute; top: 50px; right: 50px; background: #FFA500; color: white; padding: 10px 15px; border-radius: 6px; font-weight: 700; font-size: 14px;">${discount}</div>` : ''}
            
            ${brand ? `<p style="color: #666; font-size: 14px; margin: 10px 0;">Marca: <strong>${brand}</strong></p>` : ''}
            <h2 style="color: #000; margin: 15px 0 10px 0; font-size: 24px; line-height: 1.4;">${name}</h2>
            <p style="color: #0066CC; font-size: 28px; font-weight: 700; margin: 15px 0;">${price}</p>
            <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">${description}</p>
            
            <div style="display: flex; gap: 12px; margin-top: 25px;">
                <a href="https://wa.me/51923213425?text=Hola, quiero información sobre: ${name}" 
                   target="_blank" 
                   style="flex: 1; background: #25d366; color: white; border: none; padding: 14px; border-radius: 6px; text-align: center; text-decoration: none; cursor: pointer; font-weight: 600; font-size: 15px; transition: background 0.3s;">
                   Pedir por WhatsApp
                </a>
                <button onclick="this.closest('[data-modal]').remove()" 
                        style="flex: 1; background: transparent; color: #0066CC; border: 2px solid #0066CC; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 15px; transition: all 0.3s;">
                        Cerrar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Galería interactiva
    const galleryThumbs = modal.querySelectorAll('.gallery-thumb');
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            const temp = images[idx];
            images[idx] = images[0];
            images[0] = temp;

            modal.querySelector('#mainProductImage').src = images[0];
            galleryThumbs.forEach((t, i) => {
                t.src = images[i];
                t.style.borderColor = i === 0 ? '#0066CC' : 'transparent';
            });
        });
    });

    // Cerrar al hacer click fuera
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function attachDetailsListeners() {
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.removeEventListener('click', handleDetailsClick);
        btn.addEventListener('click', handleDetailsClick);
    });
}

function handleDetailsClick(event) {
    const productId = event.currentTarget.dataset.id;
    showProductModal(productId);
}
