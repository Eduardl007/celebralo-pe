# Guía de Configuración de Analytics para Celébralo pe

Esta guía te ayudará a configurar Google Analytics 4 (GA4) y Google Tag Manager (GTM) para monitorear todas las métricas de tu prototipo.

---

## Paso 1: Crear cuenta de Google Analytics 4

### 1.1 Acceder a Google Analytics
1. Ve a [analytics.google.com](https://analytics.google.com)
2. Inicia sesión con tu cuenta de Google
3. Clic en **"Empezar a medir"** o **"Crear cuenta"**

### 1.2 Configurar la cuenta
1. **Nombre de la cuenta:** `Celébralo pe`
2. Marca las casillas de uso compartido de datos según prefieras
3. Clic en **"Siguiente"**

### 1.3 Crear propiedad
1. **Nombre de la propiedad:** `Celébralo pe Prototipo`
2. **Zona horaria:** Perú (GMT-5)
3. **Moneda:** Sol peruano (PEN)
4. Clic en **"Siguiente"**

### 1.4 Información del negocio
1. Selecciona tu industria: `Otros`
2. Tamaño del negocio: El que corresponda
3. Clic en **"Crear"**

### 1.5 Configurar flujo de datos
1. Selecciona **"Web"**
2. **URL del sitio web:** `https://eduardl007.github.io`
3. **Nombre del flujo:** `Celébralo pe Web`
4. Clic en **"Crear flujo"**

### 1.6 Obtener tu ID de medición
1. Verás tu **ID de medición** que empieza con `G-`
2. **¡COPIA ESTE ID!** Lo necesitarás después
3. Ejemplo: `G-ABC123XYZ`

---

## Paso 2: Crear cuenta de Google Tag Manager (Opcional pero recomendado)

### 2.1 Acceder a GTM
1. Ve a [tagmanager.google.com](https://tagmanager.google.com)
2. Inicia sesión con tu cuenta de Google

### 2.2 Crear contenedor
1. Clic en **"Crear cuenta"**
2. **Nombre de la cuenta:** `Celébralo pe`
3. **País:** Perú
4. **Nombre del contenedor:** `Celébralo pe Web`
5. **Plataforma de destino:** Web
6. Clic en **"Crear"**

### 2.3 Obtener tu ID de GTM
1. Verás tu ID que empieza con `GTM-`
2. **¡COPIA ESTE ID!**
3. Ejemplo: `GTM-ABC123`

---

## Paso 3: Configurar los IDs en tu código

### 3.1 Editar el archivo de analytics
1. Abre el archivo `prototipo/js/analytics.js`
2. Busca estas líneas al inicio (líneas 14-16):

```javascript
const ANALYTICS_CONFIG = {
    GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX',  // <-- Reemplaza aquí
    GTM_ID: 'GTM-XXXXXXX',               // <-- Reemplaza aquí (opcional)
```

3. Reemplaza `G-XXXXXXXXXX` con tu ID de GA4
4. Reemplaza `GTM-XXXXXXX` con tu ID de GTM (si lo tienes)
5. Guarda el archivo

### 3.2 Ejemplo configurado:
```javascript
const ANALYTICS_CONFIG = {
    GA4_MEASUREMENT_ID: 'G-ABC123XYZ',
    GTM_ID: 'GTM-ABC123',
```

---

## Paso 4: Subir cambios a GitHub

Después de configurar los IDs, sube los cambios:

```bash
git add .
git commit -m "Configurar Google Analytics"
git push
```

---

## Eventos que se están rastreando

Tu prototipo ahora rastrea automáticamente:

### Navegación
| Evento | Descripción |
|--------|-------------|
| `navigation_click` | Clics en menú de navegación |
| `logo_click` | Clics en el logo |
| `footer_link_click` | Clics en enlaces del footer |

### Búsqueda
| Evento | Descripción |
|--------|-------------|
| `search` | Búsquedas realizadas |
| `search_tab_click` | Cambio de tab en búsqueda |

### Interacción con contenido
| Evento | Descripción |
|--------|-------------|
| `category_click` | Clic en categoría de evento |
| `locale_click` | Clic en tarjeta de local |
| `service_click` | Clic en tarjeta de servicio |
| `package_view` | Vista de paquete |
| `package_cta_click` | Clic en botón de paquete |

### Chatbot
| Evento | Descripción |
|--------|-------------|
| `chatbot_open` | Apertura del chatbot |
| `chatbot_close` | Cierre del chatbot |
| `chatbot_message` | Mensaje enviado |
| `chatbot_quick_action` | Clic en acción rápida |

### Autenticación
| Evento | Descripción |
|--------|-------------|
| `auth_modal_open` | Apertura de modal de login |
| `login_attempt` | Intento de login |
| `signup_attempt` | Intento de registro |
| `social_login_click` | Clic en login social |

### Engagement
| Evento | Descripción |
|--------|-------------|
| `scroll_depth` | Profundidad de scroll (25%, 50%, 75%, 90%, 100%) |
| `time_on_page` | Tiempo en página (30s, 60s, 2min, 5min) |
| `cta_click` | Clics en botones de llamada a la acción |

---

## Ver tus métricas en Google Analytics

### Reportes principales para insights:

1. **Tiempo Real** → Ver actividad en vivo
2. **Adquisición** → De dónde vienen los usuarios
3. **Engagement** → Qué páginas visitan más
4. **Eventos** → Ver todos los eventos rastreados

### Métricas clave a monitorear:

1. **Usuarios activos** - ¿Cuántos visitan el prototipo?
2. **Páginas más vistas** - ¿Qué les interesa más?
3. **Eventos más frecuentes** - ¿Qué acciones realizan?
4. **Tiempo promedio en página** - ¿Están interesados?
5. **Tasa de rebote** - ¿Se van rápido?

---

## Crear reportes personalizados

### Para obtener insights específicos:

1. Ve a **Explorar** en GA4
2. Clic en **"Crear nuevo informe"**
3. Sugerencias de informes:

#### Informe de interés por categoría:
- Dimensión: `event_name` = `category_click`
- Métrica: Cuenta de eventos
- Desglose por: `category_name`

#### Informe de uso del chatbot:
- Dimensión: `event_name` contiene `chatbot`
- Métrica: Cuenta de eventos, usuarios únicos

#### Informe de conversión (CTAs):
- Dimensión: `event_name` = `cta_click`
- Métrica: Cuenta de eventos
- Desglose por: `button_text`

---

## Modo Debug (para desarrolladores)

Para ver los eventos en la consola del navegador:

1. Abre `prototipo/js/analytics.js`
2. Cambia `DEBUG_MODE: false` a `DEBUG_MODE: true`
3. Abre la consola del navegador (F12)
4. Verás cada evento registrado en tiempo real

Para ver historial de eventos:
```javascript
Celébralo peAnalytics.showAnalyticsDashboard()
```

---

## Siguientes pasos recomendados

1. **Configura alertas** en GA4 para cambios significativos
2. **Conecta con Google Search Console** para SEO
3. **Crea audiencias** para segmentar usuarios
4. **Configura conversiones** para medir objetivos específicos

---

## Soporte

Si tienes problemas:
1. Verifica que los IDs estén correctamente configurados
2. Espera 24-48 horas para ver datos en GA4
3. Usa el modo debug para verificar que los eventos se envían

---

*Última actualización: Diciembre 2024*
