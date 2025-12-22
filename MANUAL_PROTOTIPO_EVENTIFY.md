# Manual del Prototipo Celébralo pe

## Guia Completa para Principiantes

---

## INDICE

1. [Que es este proyecto?](#1-que-es-este-proyecto)
2. [Estructura de carpetas](#2-estructura-de-carpetas)
3. [Como abrir el prototipo](#3-como-abrir-el-prototipo)
4. [Paginas del sitio web](#4-paginas-del-sitio-web)
5. [Archivos CSS (estilos)](#5-archivos-css-estilos)
6. [Archivos JavaScript (funcionalidad)](#6-archivos-javascript-funcionalidad)
7. [Datos de prueba](#7-datos-de-prueba)
8. [Como modificar contenido](#8-como-modificar-contenido)
9. [Probar en celular](#9-probar-en-celular)
10. [Problemas comunes](#10-problemas-comunes)

---

## 1. QUE ES ESTE PROYECTO?

Celébralo pe es una plataforma web para alquilar locales de eventos en Sullana, Peru.

### Tecnologias usadas:
- **HTML** = Estructura de las paginas (el esqueleto)
- **CSS** = Estilos visuales (colores, tamanos, posiciones)
- **JavaScript** = Funcionalidad interactiva (botones, filtros, chatbot)

### NO se usa:
- No hay base de datos real (los datos son de prueba)
- No hay servidor backend (todo es frontend/visual)
- No se procesan pagos reales

---

## 2. ESTRUCTURA DE CARPETAS

```
prototipo/
|
|-- index.html              <-- Pagina principal (inicio)
|
|-- assets/
|   |-- images/
|       |-- eventbot-avatar.svg    <-- Imagen del chatbot
|
|-- css/                    <-- ESTILOS (como se ve)
|   |-- variables.css       <-- Colores y tamanos globales
|   |-- base.css            <-- Estilos basicos
|   |-- components.css      <-- Botones, tarjetas, formularios
|   |-- layout.css          <-- Estructura general
|   |-- responsive.css      <-- Adaptacion a celular/tablet
|   |-- pages/
|       |-- home.css        <-- Estilos solo para inicio
|
|-- js/                     <-- FUNCIONALIDAD (que hace)
|   |-- app.js              <-- Codigo principal
|   |-- components/
|   |   |-- header.js       <-- Menu de navegacion
|   |   |-- chatbot.js      <-- Bot de chat
|   |   |-- auth.js         <-- Login y registro
|   |   |-- cards.js        <-- Tarjetas de locales
|   |   |-- toast.js        <-- Notificaciones
|   |-- data/
|   |   |-- locales.js      <-- DATOS DE LOCALES (importante!)
|   |   |-- servicios.js    <-- DATOS DE SERVICIOS (importante!)
|   |-- utils/
|   |   |-- helpers.js      <-- Funciones auxiliares
|   |-- pages/
|       |-- home.js         <-- Funciones del inicio
|
|-- pages/                  <-- OTRAS PAGINAS
    |-- locales.html        <-- Catalogo de locales
    |-- servicios.html      <-- Catalogo de servicios
    |-- paquetes.html       <-- Paquetes combinados
    |-- local.html          <-- Detalle de un local
    |-- cotizador.html      <-- Armador de presupuesto
    |-- como-funciona.html  <-- Explicacion del proceso
    |-- registro-proveedor.html <-- Para duenos de locales
```

---

## 3. COMO ABRIR EL PROTOTIPO

### Opcion A: Doble clic (mas facil)
1. Ve a la carpeta `prototipo`
2. Doble clic en `index.html`
3. Se abre en tu navegador

### Opcion B: Desde VS Code (recomendado)
1. Abre VS Code
2. File > Open Folder > selecciona `prototipo`
3. Clic derecho en `index.html`
4. "Open with Live Server" (necesitas la extension)

### Opcion C: Servidor local (para celular)
```bash
cd "D:\Pc ant\PROYECTOS DE EMPRENDIMIENTO\alquiler\prototipo"
python -m http.server 8080 --bind 0.0.0.0
```
Luego abre en el celular: `http://192.168.0.11:8080`

---

## 4. PAGINAS DEL SITIO WEB

### 4.1 index.html (Pagina de Inicio)
**Ubicacion:** `prototipo/index.html`

**Secciones:**
- Hero (banner principal con buscador)
- Categorias de eventos
- Locales destacados
- Como funciona (3 pasos)
- Servicios disponibles
- Testimonios
- CTA (llamada a la accion)
- Footer (pie de pagina)

---

### 4.2 locales.html (Catalogo de Locales)
**Ubicacion:** `prototipo/pages/locales.html`

**Funcionalidades:**
- Filtros laterales (precio, capacidad, tipo)
- Ordenar resultados
- Vista en grid o lista
- Tarjetas con info de cada local

---

### 4.3 servicios.html (Catalogo de Servicios)
**Ubicacion:** `prototipo/pages/servicios.html`

**Categorias:**
- Catering
- Musica/DJ
- Fotografia
- Decoracion
- Pasteleria

---

### 4.4 paquetes.html (Paquetes Todo Incluido)
**Ubicacion:** `prototipo/pages/paquetes.html`

**Paquetes:**
- Basico
- Estandar
- Premium
- Personalizado

---

### 4.5 local.html (Detalle de Local)
**Ubicacion:** `prototipo/pages/local.html`

**Muestra:**
- Galeria de fotos
- Descripcion completa
- Amenidades (wifi, estacionamiento, etc.)
- Disponibilidad
- Resenas
- Formulario de reserva
- Informacion del propietario

**Como acceder:** Clic en cualquier tarjeta de local

---

### 4.6 cotizador.html (Armador de Presupuesto)
**Ubicacion:** `prototipo/pages/cotizador.html`

**Pasos:**
1. Detalles del evento (tipo, fecha, invitados)
2. Seleccionar local
3. Agregar servicios
4. Ver resumen y reservar

---

### 4.7 como-funciona.html
**Ubicacion:** `prototipo/pages/como-funciona.html`

**Contenido:**
- Proceso de reserva
- Beneficios de Celébralo pe
- Video explicativo (placeholder)
- Preguntas frecuentes

---

## 5. ARCHIVOS CSS (ESTILOS)

### 5.1 variables.css - Configuracion Global
**Ubicacion:** `prototipo/css/variables.css`

```css
/* COLORES PRINCIPALES */
--primary: #6366F1;        /* Violeta - color principal */
--secondary: #EC4899;      /* Rosa - color secundario */
--accent: #F59E0B;         /* Naranja - acentos */

/* COLORES DE TEXTO */
--text-primary: #1F2937;   /* Texto principal (casi negro) */
--text-secondary: #6B7280; /* Texto secundario (gris) */
--text-muted: #9CA3AF;     /* Texto apagado */

/* COLORES DE FONDO */
--white: #FFFFFF;
--gray-50: #F9FAFB;        /* Fondo claro */
--gray-100: #F3F4F6;

/* COLORES DE ESTADO */
--success: #10B981;        /* Verde - exito */
--warning: #F59E0B;        /* Naranja - advertencia */
--error: #EF4444;          /* Rojo - error */

/* TAMANOS DE TEXTO */
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */

/* ESPACIADOS */
--spacing-1: 0.25rem;      /* 4px */
--spacing-2: 0.5rem;       /* 8px */
--spacing-4: 1rem;         /* 16px */
--spacing-6: 1.5rem;       /* 24px */
--spacing-8: 2rem;         /* 32px */

/* BORDES REDONDEADOS */
--radius-sm: 0.25rem;      /* 4px */
--radius-md: 0.5rem;       /* 8px */
--radius-lg: 0.75rem;      /* 12px */
--radius-xl: 1rem;         /* 16px */
--radius-full: 9999px;     /* Circular */
```

### Como cambiar colores:
1. Abre `variables.css`
2. Busca el color que quieres cambiar
3. Cambia el valor hexadecimal (#XXXXXX)
4. Guarda y recarga la pagina

---

### 5.2 responsive.css - Adaptacion Movil
**Ubicacion:** `prototipo/css/responsive.css`

**Breakpoints (puntos de quiebre):**
```css
/* Tablet */
@media (max-width: 1024px) { ... }

/* Movil grande */
@media (max-width: 768px) { ... }

/* Movil pequeno */
@media (max-width: 480px) { ... }
```

---

## 6. ARCHIVOS JAVASCRIPT (FUNCIONALIDAD)

### 6.1 app.js - Codigo Principal
**Ubicacion:** `prototipo/js/app.js`

**Funciones principales:**
- `initApp()` - Inicia la aplicacion
- `openAuthModal()` - Abre modal de login
- `closeModal()` - Cierra modales

---

### 6.2 header.js - Menu de Navegacion
**Ubicacion:** `prototipo/js/components/header.js`

**Funciones:**
- Menu hamburguesa en movil
- Scroll del header
- Navegacion activa

---

### 6.3 chatbot.js - Bot de Chat
**Ubicacion:** `prototipo/js/components/chatbot.js`

**Funciones:**
- `initChatbot()` - Inicia el chatbot
- `toggleChatbot()` - Abre/cierra ventana
- `sendMessage()` - Envia mensaje
- `getBotResponse()` - Respuesta automatica

**Respuestas programadas:**
- "hola" -> Saludo
- "precio" -> Info de precios
- "local" -> Buscar locales
- "ayuda" -> Menu de opciones

---

### 6.4 auth.js - Login y Registro
**Ubicacion:** `prototipo/js/components/auth.js`

**Funciones:**
- `openAuthModal(type)` - type = 'login' o 'register'
- `switchAuthForm(type)` - Cambia entre login/registro
- `handleLogin()` - Procesa login
- `handleRegister()` - Procesa registro

**NOTA:** El login es simulado, no hay base de datos real.

---

## 7. DATOS DE PRUEBA

### 7.1 locales.js - Base de Datos de Locales
**Ubicacion:** `prototipo/js/data/locales.js`

**Estructura de un local:**
```javascript
{
    id: 1,
    name: "Salon Imperial",
    slug: "salon-imperial",           // URL amigable
    icon: "🏰",                        // Emoji
    category: "salon",                 // Tipo
    location: {
        address: "Av. Jose de Lama 234",
        district: "Sullana",
        city: "Piura",
        coordinates: { lat: -4.903, lng: -80.685 }
    },
    capacity: {
        min: 50,
        max: 200
    },
    price: {
        base: 1500,                    // Precio en soles
        perPerson: null,
        deposit: 500
    },
    rating: 4.8,                       // Calificacion
    reviewsCount: 127,                 // Numero de resenas
    description: "Elegante salon...",
    shortDescription: "El mas elegante...",
    amenities: [                       // Servicios incluidos
        { name: "Aire Acondicionado", icon: "fa-snowflake" },
        { name: "Estacionamiento", icon: "fa-parking" },
        // ...
    ],
    eventTypes: ["matrimonio", "quinceanos", "corporativo"],
    availability: {
        monday: { available: true, hours: "10:00 - 23:00" },
        // ...
    },
    badges: ["Verificado", "Premium"],
    owner: {
        name: "Maria Rodriguez",
        avatar: "MR",
        responseRate: 98,
        responseTime: "< 1 hora"
    },
    contact: {
        phone: "073-123456",
        whatsapp: "51999888777",
        email: "contacto@salonimperial.pe"
    }
}
```

### Como agregar un nuevo local:
1. Abre `prototipo/js/data/locales.js`
2. Copia un local existente
3. Cambia el `id` (debe ser unico)
4. Modifica los datos
5. Guarda el archivo

---

### 7.2 servicios.js - Base de Datos de Servicios
**Ubicacion:** `prototipo/js/data/servicios.js`

**Estructura de un servicio:**
```javascript
{
    id: 1,
    name: "Catering Gourmet Sullana",
    slug: "catering-gourmet-sullana",
    icon: "🍽️",
    category: "catering",              // catering, musica, fotografia, decoracion, pasteleria
    description: "Servicio de catering...",
    shortDescription: "Buffet y menu...",
    pricing: {
        type: "per-person",            // per-person o fixed
        basePrice: 35,                 // Precio base
        currency: "PEN",
        packages: [
            {
                name: "Menu Clasico",
                price: 35,
                description: "Entrada + plato + postre",
                includes: ["Entrada", "Plato de fondo", "Postre"]
            }
        ]
    },
    // ...
}
```

---

## 8. COMO MODIFICAR CONTENIDO

### 8.1 Cambiar textos en las paginas
1. Abre el archivo `.html` que quieres editar
2. Busca el texto entre `>texto<`
3. Cambialo y guarda

**Ejemplo:**
```html
<!-- Antes -->
<h1>Encuentra el local perfecto</h1>

<!-- Despues -->
<h1>Tu evento ideal en Sullana</h1>
```

---

### 8.2 Cambiar colores
1. Abre `prototipo/css/variables.css`
2. Busca la variable del color
3. Cambia el codigo hexadecimal

**Ejemplo:**
```css
/* Antes - violeta */
--primary: #6366F1;

/* Despues - azul */
--primary: #3B82F6;
```

---

### 8.3 Agregar un nuevo local
1. Abre `prototipo/js/data/locales.js`
2. Ve al final del array `LOCALES_DATA`
3. Agrega una coma despues del ultimo `}`
4. Copia y pega la estructura de un local
5. Cambia los datos

---

### 8.4 Cambiar precios
1. Abre `prototipo/js/data/locales.js`
2. Busca el local por nombre
3. Modifica `price.base`

---

### 8.5 Cambiar imagenes
Las imagenes actualmente usan emojis y placeholders.
Para usar imagenes reales:

1. Guarda la imagen en `prototipo/assets/images/`
2. En el HTML cambia:
```html
<!-- Antes (emoji) -->
<span class="icon">🏰</span>

<!-- Despues (imagen) -->
<img src="assets/images/mi-local.jpg" alt="Mi Local">
```

---

## 9. PROBAR EN CELULAR

### Metodo 1: Herramientas de Desarrollador
1. Abre Chrome
2. Presiona F12
3. Clic en el icono de celular (arriba izquierda)
4. Selecciona un dispositivo

### Metodo 2: Servidor Local
1. Abre CMD o PowerShell
2. Navega a la carpeta:
```bash
cd "D:\Pc ant\PROYECTOS DE EMPRENDIMIENTO\alquiler\prototipo"
```
3. Inicia servidor:
```bash
python -m http.server 8080 --bind 0.0.0.0
```
4. En tu celular (misma WiFi), abre:
```
http://192.168.0.11:8080
```

### Metodo 3: Live Server (VS Code)
1. Instala extension "Live Server"
2. Clic derecho en index.html
3. "Open with Live Server"
4. Usa la IP que aparece en tu celular

---

## 10. PROBLEMAS COMUNES

### "La pagina no carga estilos"
- Verifica que las rutas CSS esten correctas
- En pages/ las rutas deben ser `../css/archivo.css`

### "El JavaScript no funciona"
- Abre la consola (F12 > Console)
- Busca errores en rojo
- Verifica las rutas de los scripts

### "El chatbot no aparece"
- Verifica que `chatbot.js` este incluido
- Revisa la consola por errores

### "No puedo ver desde el celular"
- Verifica estar en la misma red WiFi
- Revisa el firewall de Windows
- Usa la IP correcta (192.168.0.11)

### "Los filtros no funcionan"
- Verifica que `locales.js` cargue correctamente
- Revisa la consola por errores

---

## GLOSARIO RAPIDO

| Termino | Significado |
|---------|-------------|
| HTML | Lenguaje de estructura de paginas |
| CSS | Lenguaje de estilos visuales |
| JavaScript (JS) | Lenguaje de programacion para interactividad |
| DOM | Estructura del documento HTML |
| Responsive | Diseno que se adapta a diferentes pantallas |
| Breakpoint | Punto donde cambia el diseno segun el tamano |
| Modal | Ventana emergente |
| Component | Pieza reutilizable de codigo |
| Array | Lista de elementos en JavaScript |
| Object | Conjunto de datos con nombre |

---

## CONTACTO Y AYUDA

Si tienes dudas sobre el codigo, puedes:
1. Revisar este manual
2. Buscar en Google el error especifico
3. Usar ChatGPT o Claude para explicaciones

---

**Creado para:** Luis Zapata
**Proyecto:** Celébralo pe
**Version:** 1.0
**Fecha:** Diciembre 2024
