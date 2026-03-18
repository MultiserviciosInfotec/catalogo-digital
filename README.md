# AutoParts Pro - Catálogo de Autopartes Profesional

Sistema web moderno, elegante y funcional para mostrar tu catálogo de autopartes a tus clientes.

## 🚀 Características Principales

✅ **Página Principal Elegante**
- Bienvenida profesional con banner impactante
- Mostrador de ventajas (calidad, garantía, envíos rápidos)
- Productos en destaque
- Sección "Nosotros"
- Formulario de contacto
- Footer con información y redes sociales

✅ **Catálogo de Productos Completo**
- Grid responsivo de productos
- Tarjetas modernas con imagen, nombre, descripción y precio
- Filtros por categoría (Motores, Frenos, Suspensión, Accesorios)
- Barra de búsqueda en tiempo real
- Stock visible
- Botón WhatsApp integrado en cada producto

✅ **Base de Datos MySQL**
- Estructura profesional y optimizada
- 8 productos de ejemplo
- Fácil de administrar

✅ **Diseño Profesional y Responsivo**
- Colores corporativos (Negro, Rojo, Blanco)
- Tipografía moderna (Poppins)
- Adaptable a cualquier dispositivo
- Efectos hover elegantes
- Animaciones suaves

✅ **Funcionalidades Adicionales**
- Botón flotante WhatsApp
- Enlaces a redes sociales
- Integración con WhatsApp Web
- Formulario de contacto funcional

## 📋 Requisitos

- PHP 7.4+
- MySQL 5.7+
- XAMPP o servidor local equivalente

## 🔧 Instalación Rápida

### 1. Ubicación del proyecto
```
C:\xampp\htdocs\catalogo\
```

### 2. Iniciar XAMPP
- Abre XAMPP Control Panel
- Inicia Apache y MySQL

### 3. Crear la Base de Datos
- Abre phpMyAdmin: http://localhost/phpmyadmin
- Crea BD: `catalogo_autopartes`
- Importa: `db/database.sql`

### 4. Acceder al sitio
```
http://localhost/catalogo/
```

## 🌐 Páginas Principales

**Página Principal:**
```
http://localhost/catalogo/index.php
```
- Muestra bienvenida, ventajas y productos destacados
- Formulario de contacto
- Información de la empresa

**Catálogo Completo:**
```
http://localhost/catalogo/productos.php
```
- Todos los productos
- Búsqueda y filtros
- Información detallada

## 🎨 Personalización

### Cambiar nombre de la empresa
Busca "AutoParts Pro" en:
- `index.php`
- `productos.php`

### Cambiar número de teléfono
Busca "+51 999 123 456" en:
- `index.php` (línea ~70)
- `productos.php` (línea ~60)

### Cambiar número de WhatsApp
Busca "+51999123456" (sin espacios) en:
- `index.php` (múltiples lugares)
- `productos.php` (múltiples lugares)

### Cambiar email
Busca "info@autopartspro.com" en:
- `index.php`
- `productos.php`

### Cambiar dirección
Busca "Av. Principal 123, Local 45" en:
- `index.php`
- `productos.php`

### Cambiar colores
Edita `css/style.css`:
```css
:root {
    --color-primary: #111;      /* Negro */
    --color-accent: #C00000;    /* Rojo */
    --color-light: #f5f5f5;     /* Gris claro */
    --color-white: #ffffff;     /* Blanco */
}
```

## 📁 Estructura de Carpetas

```
catalogo/
│
├── index.php                    # Página principal
├── productos.php                # Catálogo de productos
├── obtener_producto.php         # API para detalles
├── procesar_contacto.php        # Procesa contactos
│
├── css/
│   └── style.css               # Estilos principales
│
├── js/
│   └── main.js                 # JavaScript
│
├── images/                      # Imágenes (vacía inicialmente)
│
├── db/
│   ├── config.php              # Configuración BD
│   └── database.sql            # Script de BD
│
├── admin/                       # (Para desarrollo futuro)
│
├── README.md                    # Este archivo
└── INSTALACION.md              # Guía de instalación
```

## 🔐 Configuración de Base de Datos

Archivo: `db/config.php`

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'catalogo_autopartes');
```

Si necesitas cambiar estos valores, edita `db/config.php`.

## 🗄️ Estructura de Base de Datos

### Tabla: productos
- `id` - Identificador único
- `nombre` - Nombre del producto
- `descripcion` - Descripción detallada
- `precio` - Precio
- `imagen` - Archivo de imagen
- `categoria` - Categoría (Motores, Frenos, Suspensión, Accesorios)
- `stock` - Cantidad disponible
- `fecha_registro` - Fecha de creación

### Tabla: contactos
- `id` - Identificador único
- `nombre` - Nombre del cliente
- `email` - Email
- `mensaje` - Mensaje enviado
- `fecha_envio` - Fecha
- `leido` - Estado del mensaje

## 💡 Productos de Ejemplo

El sistema viene con 8 productos de ejemplo:

1. Motor V8 5.0L - S/. 12,500.00
2. Pastillas de Freno Premium - S/. 450.00
3. Amortiguadores Profesionales - S/. 2,800.00
4. Batería 12V 100Ah - S/. 850.00
5. Filtro de Aire Deportivo - S/. 320.00
6. Discos de Freno Ventilado - S/. 1,200.00
7. Juego de Inyectores - S/. 3,200.00
8. Espirales de Suspensión - S/. 950.00

Puedes modificar estos directamente en `db/database.sql` antes de importar, o más adelante editándolos en la base de datos.

## 🐛 Solucionar Problemas

### Error de conexión a BD
- Verifica que MySQL esté corriendo
- Comprueba credenciales en `db/config.php`
- Asegúrate de que la BD existe

### No aparecen los productos
- Verifica que `db/database.sql` fue importado
- Comprueba en phpMyAdmin que la tabla "productos" tiene registros
- Recarga la página (Ctrl+F5)

### WhatsApp no funciona
- Verifica que el número es correcto (formato internacional)
- Comprueba que está sin espacios ni caracteres especiales
- Asegúrate de que el navegador permite abrir nuevas pestañas

## 📱 Responsividad

El sitio funciona perfectamente en:
- ✅ Desktop (pantallas grandes)
- ✅ Tablet (pantallas medianas)
- ✅ Mobile (teléfonos)

Grid de productos:
- Desktop: 4 columnas
- Tablet: 2-3 columnas
- Mobile: 1 columna

## ✨ Características Especiales

**WhatsApp Integrado**
- Botón flotante en esquina inferior derecha
- Botón en cada producto
- Enlace dinámico con nombre del producto
- Abre WhatsApp Web automáticamente

**Búsqueda en Tiempo Real**
- Escribe para buscar productos
- Filtra por categoría
- Resultados instantáneos

**Contacto**
- Formulario simple pero efectivo
- Almacena mensajes en BD
- Email del cliente visible

## 🌍 Publicar en Internet

Cuando estés listo para publicar:

1. Contrata un hosting web (con PHP y MySQL)
2. Sube todos los archivos por FTP
3. Importa la BD en el servidor
4. Edita `db/config.php` con nuevas credenciales
5. Configura tu dominio
6. Instala certificado SSL (HTTPS)

## 📞 Información de Contacto (Actualizar)

Empresa: AutoParts Pro (cambiar)
Teléfono: +51 999 123 456 (cambiar)
Email: info@autopartspro.com (cambiar)
Dirección: Av. Principal 123, Local 45 (cambiar)

---

**Tu catálogo profesional de autopartes está 100% funcional y listo para usar.**

¡Ahora muéstralo a tus clientes!

---

**Última actualización:** 24/02/2026
**Versión:** 1.0
