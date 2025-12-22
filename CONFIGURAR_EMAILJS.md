# Configurar EmailJS - Celébralo pe

## Estado Actual

EmailJS ya esta configurado con las siguientes credenciales:

| Dato | Valor |
|------|-------|
| Public Key | `0dYuscUBKL8b-TRsX` |
| Service ID | `service_ealwt3e` |
| Template (Waitlist) | `template_x0x0gnu` |

Los formularios que usan EmailJS:
- `landing.html` - Lista de espera
- `pages/registro-proveedor.html` - Registro de proveedores

---

## Archivos del Sistema

```
prototipo/
├── js/
│   └── services/
│       └── emailjs.js      <- Servicio centralizado
├── landing.html            <- Usa EmailJS directamente
└── pages/
    └── registro-proveedor.html  <- Usa EmailJSService
```

---

## PASO 1: Crear cuenta (si no la tienes)

1. Abre: https://www.emailjs.com
2. Click "Sign Up Free"
3. Registrate con tu email

---

## PASO 2: Conectar servicio de email

1. En el dashboard, ve a **Email Services**
2. Click **Add New Service**
3. Selecciona **Gmail**
4. Click **Connect Account**
5. Inicia sesion con tu Gmail y autoriza
6. Ponle nombre: `Celébralo pe`
7. Click **Create Service**

**GUARDA TU SERVICE ID:** `service_xxxxxxx`

---

## PASO 3: Crear plantilla de Lista de Espera

1. Ve a **Email Templates**
2. Click **Create New Template**
3. Configura asi:

### Pestaña "Content":

**Subject (Asunto):**
```
¡Bienvenido a Celébralo pe, {{to_name}}!
```

**Content (Cuerpo del email):**

Cambia a modo **Code** (icono </>) y pega este HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #004E89 0%, #FF6B35 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Celébralo pe</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu plataforma de eventos en Sullana</p>
            </td>
        </tr>

        <!-- Saludo -->
        <tr>
            <td style="padding: 40px 30px 20px 30px;">
                <h2 style="color: #004E89; margin: 0 0 15px 0;">¡Hola {{to_name}}!</h2>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">
                    Gracias por unirte a la lista de espera de <strong>Celébralo pe</strong>.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 15px 0 0 0;">
                    Eres parte de un grupo exclusivo que tendra <strong>acceso anticipado</strong> a la plataforma que esta cambiando la forma de organizar eventos en Sullana.
                </p>
            </td>
        </tr>

        <!-- Beneficios -->
        <tr>
            <td style="padding: 0 30px 30px 30px;">
                <div style="background-color: #f8f9fa; border-radius: 10px; padding: 25px; border-left: 4px solid #FF6B35;">
                    <h3 style="color: #004E89; margin: 0 0 15px 0;">Lo que viene para ti:</h3>
                    <p style="margin: 0 0 10px 0; color: #333;">✅ Acceso anticipado <strong>GRATIS</strong></p>
                    <p style="margin: 0 0 10px 0; color: #333;">✅ Descuentos exclusivos de lanzamiento</p>
                    <p style="margin: 0; color: #333;">✅ Soporte prioritario</p>
                </div>
            </td>
        </tr>

        <!-- Que es Celébralo pe -->
        <tr>
            <td style="padding: 0 30px 30px 30px;">
                <h3 style="color: #004E89; margin: 0 0 15px 0;">¿Que es Celébralo pe?</h3>
                <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0;">
                    Somos la primera plataforma en Sullana donde podras:
                </p>
                <ul style="color: #333; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                    <li>Ver todos los locales para eventos en un solo lugar</li>
                    <li>Comparar precios y disponibilidad al instante</li>
                    <li>Reservar en minutos, sin llamadas ni esperas</li>
                </ul>
            </td>
        </tr>

        <!-- CTA -->
        <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0 0 20px 0;">Mientras tanto, siguenos en redes:</p>
                <a href="https://facebook.com/celebralope" style="display: inline-block; margin: 0 10px; color: #004E89; text-decoration: none;">Facebook</a>
                <a href="https://instagram.com/celebralo.peru" style="display: inline-block; margin: 0 10px; color: #004E89; text-decoration: none;">Instagram</a>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="background-color: #004E89; padding: 25px 30px; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 5px 0;">
                    ¿Tienes preguntas? Responde a este correo.
                </p>
                <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
                    © 2025 Celébralo pe | Sullana, Piura
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
```

4. Click **Save**

**GUARDA TU TEMPLATE ID:** `template_xxxxxxx`

---

## PASO 4: Crear plantilla para Proveedores (Opcional)

Si quieres un email personalizado para proveedores:

1. Ve a **Email Templates** → **Create New Template**
2. Nombre: `template_proveedor`

**Subject:**
```
¡Bienvenido a Celébralo pe, {{to_name}}! - Tu negocio: {{business_name}}
```

**Content (HTML):**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #004E89 0%, #FF6B35 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Celébralo pe</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Plataforma de Proveedores</p>
            </td>
        </tr>

        <!-- Saludo -->
        <tr>
            <td style="padding: 40px 30px 20px 30px;">
                <h2 style="color: #004E89; margin: 0 0 15px 0;">¡Hola {{to_name}}!</h2>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">
                    Hemos recibido tu solicitud para registrar <strong>{{business_name}}</strong> en Celébralo pe.
                </p>
            </td>
        </tr>

        <!-- Info del registro -->
        <tr>
            <td style="padding: 0 30px 30px 30px;">
                <div style="background-color: #f8f9fa; border-radius: 10px; padding: 25px; border-left: 4px solid #FF6B35;">
                    <h3 style="color: #004E89; margin: 0 0 15px 0;">Detalles de tu registro:</h3>
                    <p style="margin: 0 0 10px 0; color: #333;"><strong>Tipo:</strong> {{business_type}}</p>
                    <p style="margin: 0 0 10px 0; color: #333;"><strong>Categoria:</strong> {{category}}</p>
                </div>
            </td>
        </tr>

        <!-- Proximos pasos -->
        <tr>
            <td style="padding: 0 30px 30px 30px;">
                <h3 style="color: #004E89; margin: 0 0 15px 0;">Proximos pasos:</h3>
                <ol style="color: #333; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                    <li>Revisaremos tu solicitud en las proximas 24 horas</li>
                    <li>Te contactaremos por WhatsApp o email para verificar datos</li>
                    <li>Una vez aprobado, tu negocio aparecera en la plataforma</li>
                </ol>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="background-color: #004E89; padding: 25px 30px; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 5px 0;">
                    ¿Tienes preguntas? Responde a este correo.
                </p>
                <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
                    © 2025 Celébralo pe | Sullana, Piura
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
```

3. En **Settings**:
   - **To Email:** `{{to_email}}`
   - **From Name:** `Celébralo pe`

4. Click **Save**

**GUARDA TU TEMPLATE ID:** `template_proveedor`

---

## PASO 5: Configurar remitente

En cada plantilla, ve a la pestaña **Settings**:

- **To Email:** `{{to_email}}`
- **From Name:** `Celébralo pe`
- **Reply To:** `tu-email@gmail.com` (tu email real)

Click **Save**

---

## PASO 6: Obtener Public Key

1. Click en tu nombre (arriba derecha) → **Account**
2. Ve a la pestaña **API Keys**
3. Copia tu **Public Key**

**GUARDA TU PUBLIC KEY:** `xxxxxxxxxxxxxxxxx`

---

## PASO 7: Actualizar credenciales en el codigo

### Opcion A: Servicio centralizado (recomendado)

Abre `prototipo/js/services/emailjs.js` y actualiza:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'TU_PUBLIC_KEY',
    serviceId: 'TU_SERVICE_ID',
    templates: {
        waitlist: 'TU_TEMPLATE_WAITLIST',
        proveedor: 'TU_TEMPLATE_PROVEEDOR',  // opcional
        contacto: 'TU_TEMPLATE_CONTACTO'     // opcional
    }
};
```

### Opcion B: Solo landing.html

Abre `prototipo/landing.html` y busca (linea ~645):

```javascript
const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'TU_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';
```

---

## PASO 8: Probar

1. Sube la carpeta `prototipo` a Netlify
2. Prueba el formulario de lista de espera en `/landing.html`
3. Prueba el registro de proveedor en `/pages/registro-proveedor.html`
4. Revisa tu correo (inbox y spam)

---

## Uso del Servicio Centralizado

El archivo `js/services/emailjs.js` expone estas funciones:

```javascript
// Inicializar (se hace automaticamente)
EmailJSService.init();

// Enviar email de bienvenida (lista de espera)
await EmailJSService.sendWaitlistEmail({
    name: 'Juan Perez',
    email: 'juan@email.com',
    userType: 'organizador'
});

// Enviar email a proveedor
await EmailJSService.sendProveedorEmail({
    ownerName: 'Maria Garcia',
    ownerEmail: 'maria@email.com',
    businessName: 'Salon Los Jardines',
    businessType: 'local',
    category: 'salon'
});
```

---

## LIMITES DEL PLAN GRATUITO

EmailJS gratis incluye:
- 200 emails/mes
- 2 plantillas
- Soporte basico

Para tu etapa de validacion, esto es suficiente.

---

## RESUMEN DE CREDENCIALES ACTUALES

| Dato | Valor |
|------|-------|
| Service ID | `service_ealwt3e` |
| Template (Waitlist) | `template_x0x0gnu` |
| Template (Proveedor) | `template_proveedor` (crear) |
| Public Key | `0dYuscUBKL8b-TRsX` |
