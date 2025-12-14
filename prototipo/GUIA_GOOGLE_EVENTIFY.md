# Guia de Integracion con Google - Eventify

## Resumen de Servicios Configurados

Esta guia te ayudara a configurar y acceder a todos los servicios de Google para monitorear tu plataforma Eventify.

---

## 1. Google Sheets (Base de Datos)

### Que almacena:
- **Usuarios**: Registros de usuarios nuevos
- **Reservas**: Todas las reservas de locales
- **Consultas**: Preguntas del chatbot
- **Proveedores**: Registros de locales y servicios
- **Cotizaciones**: Solicitudes de cotizacion
- **Leads**: Personas interesadas
- **Feedback**: Comentarios y sugerencias
- **Busquedas**: Historial de busquedas

### Como configurar:

#### Paso 1: Crear la hoja de calculo
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja: "Eventify - Base de Datos"
3. Crea estas pestanas (hojas):
   - Usuarios
   - Reservas
   - Consultas
   - Proveedores
   - Cotizaciones
   - Leads
   - Feedback
   - Busquedas

#### Paso 2: Agregar encabezados
En cada hoja, agrega estos encabezados en la fila 1:

**Usuarios:**
```
id | nombre | apellido | email | telefono | tipoRegistro | estado | fechaRegistro | timestamp | userAgent | source
```

**Reservas:**
```
id | usuario | email | telefono | tipoEvento | fechaEvento | cantidadInvitados | local | localId | serviciosAdicionales | precioTotal | estado | fechaReserva | timestamp
```

**Consultas:**
```
id | consulta | respuesta | categoria | fecha | hora | timestamp
```

**Proveedores:**
```
id | nombreNegocio | nombreContacto | email | telefono | tipo | categoria | direccion | descripcion | capacidad | precioDesde | estado | fechaRegistro | timestamp
```

**Cotizaciones:**
```
id | nombre | email | telefono | tipoEvento | fechaEvento | cantidadInvitados | serviciosSolicitados | presupuesto | comentarios | estado | fechaCotizacion | timestamp
```

**Leads:**
```
id | nombre | email | telefono | interes | origen | campania | fecha | timestamp
```

**Feedback:**
```
id | tipo | mensaje | email | calificacion | fecha | timestamp
```

**Busquedas:**
```
tipoEvento | fecha | invitados | categoria | fechaBusqueda | horaBusqueda | timestamp
```

#### Paso 3: Crear el Web App

1. En tu Google Sheet, ve a **Extensiones > Apps Script**
2. Borra el codigo existente
3. Pega este codigo:

```javascript
// EVENTIFY - Google Apps Script Web App

const SPREADSHEET_ID = 'PEGA_TU_ID_AQUI';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(data.sheet);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Hoja no encontrada: ' + data.sheet
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(header => data.data[header] || '');
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Datos guardados'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Eventify API funcionando'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

4. Reemplaza `PEGA_TU_ID_AQUI` con el ID de tu hoja (esta en la URL)
5. Guarda el proyecto (Ctrl+S)
6. Click en **Implementar > Nueva implementacion**
7. Selecciona **Aplicacion web**
8. Ejecutar como: **Yo**
9. Quien tiene acceso: **Cualquier persona**
10. Click en **Implementar**
11. Copia la URL del Web App

#### Paso 4: Configurar en Eventify

Abre el archivo `js/services/googleSheets.js` y reemplaza:
```javascript
webAppUrl: 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec',
```
Con tu URL del Web App.

### URL de Acceso:
```
https://docs.google.com/spreadsheets/d/TU_ID/edit
```

---

## 2. Google Analytics 4 (Metricas)

### Que mide:
- Visitas a la pagina
- Usuarios nuevos vs recurrentes
- Busquedas realizadas
- Registros de usuarios
- Uso del chatbot
- Conversiones (reservas, cotizaciones)
- Tiempo en el sitio
- Paginas mas visitadas

### Como configurar:

#### Paso 1: Crear cuenta
1. Ve a [Google Analytics](https://analytics.google.com)
2. Click en **Empezar a medir**
3. Nombre de cuenta: `Eventify Peru`
4. Click **Siguiente**

#### Paso 2: Crear propiedad
1. Nombre: `Eventify Web`
2. Zona horaria: **(GMT-05:00) Peru**
3. Moneda: **Soles peruanos (PEN)**
4. Click **Siguiente**

#### Paso 3: Crear stream de datos
1. Selecciona **Web**
2. URL del sitio: tu dominio (ej: eventify.pe)
3. Nombre del stream: `Eventify Website`
4. Click **Crear stream**

#### Paso 4: Obtener Measurement ID
- El ID tiene formato: `G-XXXXXXXXXX`
- Copialo

#### Paso 5: Configurar en Eventify
Abre el archivo `js/services/analytics.js` y reemplaza:
```javascript
measurementId: 'G-XXXXXXXXXX',
```
Con tu Measurement ID.

### URL de Acceso:
```
https://analytics.google.com/analytics/web/
```

---

## 3. Indicadores Clave (KPIs)

### En Google Sheets puedes medir:

| Indicador | Donde verlo | Formula |
|-----------|-------------|---------|
| Usuarios registrados | Hoja Usuarios | Contar filas |
| Reservas totales | Hoja Reservas | Contar filas |
| Tasa de conversion | Reservas/Visitas | (Reservas/Usuarios)*100 |
| Consultas chatbot | Hoja Consultas | Contar filas |
| Tipos de eventos | Hoja Busquedas | Tabla dinamica |
| Proveedores activos | Hoja Proveedores | Filtrar por estado |

### Formulas utiles en Google Sheets:

```
=CONTAR(A:A)-1                    // Total de registros
=CONTARA(A2:A)                    // Filas con datos
=CONTAR.SI(F:F,"activo")          // Usuarios activos
=SUMAR(K:K)                       // Total en ventas
=PROMEDIO(K:K)                    // Ticket promedio
=HOY()-FECHA.VALOR(H2)            // Dias desde registro
```

### En Google Analytics puedes ver:

| Metrica | Ruta en Analytics |
|---------|-------------------|
| Visitas totales | Informes > Adquisicion |
| Usuarios activos | Tiempo real |
| Paginas populares | Informes > Interaccion > Paginas |
| Fuentes de trafico | Informes > Adquisicion > Trafico |
| Eventos personalizados | Informes > Interaccion > Eventos |

---

## 4. Dashboard Recomendado

### Crea un dashboard en Google Sheets con:

1. **Resumen Diario**
   - Nuevos usuarios hoy
   - Reservas del dia
   - Consultas de chatbot

2. **Resumen Semanal**
   - Crecimiento de usuarios
   - Tipos de eventos mas buscados
   - Proveedores nuevos

3. **Metricas de Conversion**
   - Visitas a reservas
   - Cotizaciones a ventas
   - Leads a clientes

### Ejemplo de formula para dashboard:
```
=CONTAR.SI(Usuarios!G:G,HOY())    // Usuarios registrados hoy
=CONTAR.SI(Reservas!M:M,HOY())    // Reservas de hoy
```

---

## 5. Alertas y Notificaciones

### Configurar alertas en Google Sheets:

1. Ve a **Extensiones > Apps Script**
2. Agrega esta funcion:

```javascript
function sendDailyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const usuarios = ss.getSheetByName('Usuarios').getLastRow() - 1;
  const reservas = ss.getSheetByName('Reservas').getLastRow() - 1;
  const consultas = ss.getSheetByName('Consultas').getLastRow() - 1;

  const mensaje = `
    Reporte Diario Eventify
    ========================
    Usuarios totales: ${usuarios}
    Reservas totales: ${reservas}
    Consultas chatbot: ${consultas}

    Fecha: ${new Date().toLocaleDateString('es-PE')}
  `;

  MailApp.sendEmail('tu@email.com', 'Reporte Diario Eventify', mensaje);
}
```

3. Ve a **Activadores** (icono de reloj)
4. Crea un activador diario para `sendDailyReport`

---

## 6. Resumen de URLs de Acceso

| Servicio | URL |
|----------|-----|
| Google Sheets (Datos) | https://docs.google.com/spreadsheets/d/TU_ID/edit |
| Google Analytics | https://analytics.google.com |
| Apps Script | https://script.google.com |

---

## 7. Soporte

Si tienes problemas:
1. Verifica que los IDs esten correctamente configurados
2. Revisa la consola del navegador (F12) para ver errores
3. Comprueba que el Web App este publicado correctamente

Los datos se guardan localmente si hay problemas de conexion y se sincronizan automaticamente cuando vuelve internet.
