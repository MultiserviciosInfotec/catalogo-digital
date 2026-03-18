/**
 * ========================================
 * PRODUCTOS - Funcionalidades del Catálogo
 * ========================================
 * 
 * Gestiona:
 * - Paginación de productos
 * - Filtrado de productos por categoría
 * - Búsqueda de productos
 * - Modal de detalles de producto
 * - Integración con WhatsApp
 * - Descuentos dinámicos
 * - Marcas de productos
 */

const PRODUCTS_PER_PAGE = 12;
let currentPage = 1;
let filteredProducts = [];
let allProducts = [];
let selectedCategory = 'all'; // Track selected category

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function () {
    // Obtener todos los productos (excluyendo refurbished que están en su propia sección)
    allProducts = Array.from(document.querySelectorAll('.products-grid .product-card'));
    filteredProducts = [...allProducts];
    
    // Ocultar/mostrar elementos vacíos
    allProducts.forEach(card => {
        const brandElement = card.querySelector('.brand');
        if (brandElement && !brandElement.textContent.trim()) {
            brandElement.style.display = 'none';
        }
        
        const discountBadge = card.querySelector('.discount-badge');
        if (discountBadge && !discountBadge.textContent.trim()) {
            discountBadge.style.display = 'none';
        }
    });
    
    // Inicializar paginación
    renderPagination();
    displayProductsForPage(1);
});

// ========== PAGINACIÓN ==========
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const pageNumbersContainer = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const paginationInfo = document.getElementById('paginationInfo');
    
    // Limpiar números de página
    pageNumbersContainer.innerHTML = '';
    
    // Mostrar 7 números
    let pagesToShow = [];
    
    if (totalPages <= 7) {
        // Si hay 7 o menos páginas, mostrar todas
        pagesToShow = Array.from({length: totalPages}, (_, i) => i + 1);
    } else {
        // Mostrar 7 números: actual y 3 a cada lado
        const start = Math.max(1, currentPage - 3);
        const end = Math.min(totalPages, start + 6);
        
        for (let i = start; i <= end; i++) {
            pagesToShow.push(i);
        }
    }
    
    // Crear botones de página
    pagesToShow.forEach(pageNum => {
        if (pageNum === '...') {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.cssText = `
                padding: var(--spacing-sm) 0;
                color: var(--color-text-light);
                font-weight: 600;
            `;
            pageNumbersContainer.appendChild(dots);
        } else {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${pageNum === currentPage ? 'active' : ''}`;
            pageBtn.textContent = pageNum;
            pageBtn.addEventListener('click', () => {
                currentPage = pageNum;
                displayProductsForPage(pageNum);
                renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pageNumbersContainer.appendChild(pageBtn);
        }
    });
    
    // Actualizar botones Anterior/Siguiente (usar arrow function para evitar duplicados)
    prevBtn.replaceWith(prevBtn.cloneNode(true));
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    
    const newPrevBtn = document.getElementById('prevPage');
    const newNextBtn = document.getElementById('nextPage');
    
    newPrevBtn.disabled = currentPage === 1;
    newNextBtn.disabled = currentPage === totalPages;
    
    newPrevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProductsForPage(currentPage);
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    newNextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProductsForPage(currentPage);
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // Mostrar/ocultar paginación
    if (totalPages <= 1) {
        document.querySelector('.pagination-controls').style.display = 'none';
        paginationInfo.style.display = 'none';
    } else {
        document.querySelector('.pagination-controls').style.display = 'flex';
        paginationInfo.style.display = 'none';
    }
}

function displayProductsForPage(page) {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    
    // Ocultar todos los productos
    allProducts.forEach(product => {
        product.style.display = 'none';
    });
    
    // Mostrar solo los de la página actual
    filteredProducts.slice(startIndex, endIndex).forEach(product => {
        product.style.display = '';
    });
    
    // Reasignar eventos de detalles a los productos visibles
    attachDetailsBtnListeners();
}

// ========== BÚSQUEDA DE PRODUCTOS ==========
function applyFilters(searchTerm = '') {
    const search = searchTerm.toLowerCase().trim();
    currentPage = 1;
    
    filteredProducts = allProducts.filter(card => {
        // Aplicar filtro de categoría
        const cardCategory = card.dataset.category?.toLowerCase() || '';
        const categoryMatch = selectedCategory === 'all' || cardCategory === selectedCategory;
        
        if (!categoryMatch) return false;
        
        // Aplicar filtro de búsqueda
        if (search === '') return true;
        
        const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const productDesc = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        const productBrand = card.querySelector('.brand')?.textContent.toLowerCase() || '';
        
        return productName.includes(search) ||
               productDesc.includes(search) ||
               productBrand.includes(search);
    });
    
    renderPagination();
    displayProductsForPage(1);
    handleNoResults(filteredProducts.length, search);
}

const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', function () {
        applyFilters(this.value);
    });
}

function handleNoResults(visibleCount, searchTerm) {
    let noResults = document.getElementById('noResultsMsg');
    const productsGrid = document.querySelector('.products-grid');
    
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResults) {
            const msg = document.createElement('div');
            msg.id = 'noResultsMsg';
            msg.style.cssText = `
                grid-column: 1/-1;
                text-align: center;
                padding: 40px;
                color: #666;
            `;
            
            msg.innerHTML = `
                <i class="fas fa-search" style="font-size:48px;color:#ccc;margin-bottom:20px;display:block;"></i>
                <h3 style="color:#333;margin-bottom:10px;">No se encontraron productos</h3>
                <p style="color:#999;">Intenta con otra búsqueda</p>
            `;
            
            productsGrid.appendChild(msg);
        }
    } else if (noResults) {
        noResults.remove();
    }
}

// ========== FILTRADO POR CATEGORÍA ==========
const filterButtons = document.querySelectorAll(".filter-btn, .category-btn");

// Marcar "Todas las categorías" como activo al inicio
const allBtn = document.querySelector('[data-filter="all"]');
if (allBtn) {
    allBtn.classList.add('active');
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");
        selectedCategory = filter; // Update selected category
        currentPage = 1;
        
        // Remover clase activa de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Agregar clase activa solo al botón clickeado
        button.classList.add('active');
        
        // Mostrar/ocultar sección de Refurbished
        const refurbishedSection = document.getElementById('refurbishedSection');
        const productsGrid = document.querySelector('.products-grid');
        
        if (filter === "refurbished") {
            // Mostrar sección refurbished, ocultar grid normal
            if (refurbishedSection) refurbishedSection.classList.add('visible');
            productsGrid.style.display = 'none';
            // Ocultar paginación para refurbished
            const paginationSection = document.querySelector('.pagination-section');
            if (paginationSection) paginationSection.style.display = 'none';
            filteredProducts = [];
        } else {
            // Ocultar sección refurbished, mostrar grid normal
            if (refurbishedSection) refurbishedSection.classList.remove('visible');
            productsGrid.style.display = 'grid';
            
            // Mostrar paginación
            const paginationSection = document.querySelector('.pagination-section');
            if (paginationSection) paginationSection.style.display = 'block';
            
            // Limpiar búsqueda y aplicar filtro de categoría
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            
            // Aplicar filtros (categoría + búsqueda)
            applyFilters('');
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ========== MODAL DE DETALLES ==========
function attachDetailsBtnListeners() {
    const detailsBtns = document.querySelectorAll('.details-btn');
    
    detailsBtns.forEach(btn => {
        btn.removeEventListener('click', handleDetailsClick);
        btn.addEventListener('click', handleDetailsClick);
    });
}

function handleDetailsClick(event) {
    const productCard = event.currentTarget.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    const productDescription = productCard.querySelector('.product-description').textContent;
    const productImage = productCard.querySelector('img').src;
    const brand = productCard.querySelector('.brand')?.textContent || '';
    const discount = productCard.querySelector('.discount-badge')?.textContent || '';
    const additionalImages = productCard.dataset.images ? productCard.dataset.images.split('|') : [];
    
    showProductModal(productName, productPrice, productDescription, productImage, brand, discount, additionalImages);
}

/**
 * Muestra un modal con los detalles del producto con galería de imágenes
 * @param {string} name - Nombre del producto
 * @param {string} price - Precio del producto
 * @param {string} description - Descripción del producto
 * @param {string} mainImage - URL de la imagen principal
 * @param {string} brand - Marca del producto
 * @param {string} discount - Descuento del producto
 * @param {array} additionalImages - Array de imágenes adicionales (máximo 3)
 */
function showProductModal(name, price, description, mainImage, brand, discount, additionalImages) {
    let images = [mainImage, ...additionalImages].filter(Boolean).slice(0, 4);
    
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
    
    // Generar HTML de galería de imágenes (vertical, lado izquierdo)
    let galleryHTML = '';
    let imageContainerHTML = '';
    
    if (images.length > 1) {
        // Galería vertical a la izquierda
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
        
        // Layout con galería al lado
        imageContainerHTML = `
            <div style="display: flex; gap: 20px; margin-bottom: 20px; align-items: flex-start;">
                ${galleryHTML}
                <img id="mainProductImage" src="${images[0]}" alt="${name}" 
                     style="flex: 1; height: 350px; object-fit: scale-down; background: #f9f9f9; border-radius: 8px; position: relative;">
            </div>
        `;
    } else {
        // Solo imagen principal si no hay secundarias
        imageContainerHTML = `
            <div style="margin-bottom: 20px; position: relative;">
                <img id="mainProductImage" src="${images[0]}" alt="${name}" 
                     style="width: 100%; height: 350px; object-fit: scale-down; background: #f9f9f9; border-radius: 8px;">
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; max-width: 900px; width: 100%; position: relative; max-height: 90vh; overflow-y: auto;">
            <button onclick="this.closest('[data-modal]').remove()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; color: #666;">&times;</button>
            
            <!-- Contenedor con galería al lado izquierdo -->
            ${imageContainerHTML}
            ${discount ? `<div style="position: absolute; top: 50px; right: 50px; background: #FFA500; color: white; padding: 10px 15px; border-radius: 6px; font-weight: 700; font-size: 14px;">${discount}</div>` : ''}
            
            <!-- Información del producto -->
            ${brand ? `<p style="color: #666; font-size: 14px; margin: 10px 0;">Marca: <strong>${brand}</strong></p>` : ''}
            <h2 style="color: #000; margin: 15px 0 10px 0; font-size: 24px; line-height: 1.4;">${name}</h2>
            <p style="color: #0066CC; font-size: 28px; font-weight: 700; margin: 15px 0;">${price}</p>
            
            <!-- Descripción y características -->
            <div style="color: #666; font-size: 15px; line-height: 1.8; margin-bottom: 25px; display: flex; flex-direction: column; gap: 8px;">
                ${description.split('\n').filter(line => line.trim()).map(line => `<p style="margin: 0;">${line.trim()}</p>`).join('')}
            </div>
            
            <!-- Botones de acción -->
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
    
    // Evento para cambiar imágenes al hacer click en las miniaturas
    const galleryThumbs = modal.querySelectorAll('.gallery-thumb');
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const clickedIndex = parseInt(this.dataset.index);
            
            // Intercambiar: la imagen clicada se convierte en principal
            const temp = images[clickedIndex];
            images[clickedIndex] = images[0];
            images[0] = temp;
            
            // Actualizar imagen principal
            modal.querySelector('#mainProductImage').src = images[0];
            
            // Actualizar todas las miniaturas con sus nuevas imágenes
            galleryThumbs.forEach((t, i) => {
                t.src = images[i];
                t.style.borderColor = i === 0 ? '#0066CC' : 'transparent';
            });
        });
    });
    
    // Cerrar modal al hacer click fuera de él
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Ejecutar al cargar para los productos iniciales
attachDetailsBtnListeners();
