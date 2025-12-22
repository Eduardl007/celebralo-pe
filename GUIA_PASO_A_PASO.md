# Guia Paso a Paso - Lanzamiento Celébralo pe

## PASO 1: CREAR ENCUESTAS EN GOOGLE FORMS

### 1.1 Acceder a Google Forms
1. Abre: https://forms.google.com
2. Inicia sesion con tu cuenta de Google
3. Click en **"+ En blanco"** para crear nuevo formulario

### 1.2 Crear Encuesta de CLIENTES

**Configuracion inicial:**
1. Titulo: `Ayudanos a mejorar la organizacion de eventos en Sullana`
2. Descripcion: `Esta encuesta nos ayudara a crear una mejor herramienta para organizar eventos. Solo toma 3 minutos. Tus respuestas son anonimas.`

**Agregar preguntas (copiar del archivo ENCUESTAS_VALIDACION.md):**
- Usa el boton **"+"** para agregar cada pregunta
- Tipos de pregunta:
  - Seleccion multiple = "Casillas de verificacion"
  - Seleccion unica = "Opcion multiple"
  - Escala 1-5 = "Escala lineal"
  - Respuesta corta = "Respuesta corta"

**Configuracion final:**
1. Click en engranaje (Configuracion)
2. Activa "Recopilar direcciones de correo" (opcional)
3. Activa "Limitar a 1 respuesta" (opcional)
4. Elige un tema de color (naranja para Celébralo pe)

**Obtener link:**
1. Click en "Enviar" (boton morado arriba)
2. Click en icono de enlace (cadena)
3. Marca "Acortar URL"
4. Copia el link

### 1.3 Crear Encuesta de DUENOS DE LOCALES
- Repetir proceso con preguntas de la Seccion 2 del archivo ENCUESTAS_VALIDACION.md

### 1.4 Crear Encuesta de PROVEEDORES
- Repetir proceso con preguntas de la Seccion 3 del archivo ENCUESTAS_VALIDACION.md

### 1.5 Links de tus encuestas (completar)
```
CLIENTES:      https://forms.gle/_______________
DUENOS:        https://forms.gle/_______________
PROVEEDORES:   https://forms.gle/_______________
```

---

## PASO 2: SUBIR LANDING PAGE A NETLIFY (GRATIS)

### 2.1 Crear cuenta en Netlify
1. Abre: https://www.netlify.com
2. Click "Sign up"
3. Elige "Sign up with GitHub" o "Sign up with email"
4. Confirma tu correo

### 2.2 Subir tu sitio (Metodo drag & drop)

**Preparar carpeta:**
Tu carpeta `prototipo` ya tiene todo lo necesario.

**Subir:**
1. En Netlify, ve a "Sites"
2. Veras un area que dice "Drag and drop your site folder here"
3. Arrastra la carpeta `prototipo` completa ahi
4. Espera 30 segundos

**Tu sitio estara en:**
```
https://[nombre-aleatorio].netlify.app
```

### 2.3 Personalizar dominio (opcional pero recomendado)

**Cambiar nombre:**
1. En tu sitio, click "Site settings"
2. Click "Change site name"
3. Escribe: `celebralope-peru`
4. Tu URL sera: `https://celebralope-peru.netlify.app`

**Dominio propio (opcional, ~$12/ano):**
1. Comprar dominio en Namecheap o GoDaddy
2. En Netlify: Domain settings > Add custom domain
3. Seguir instrucciones de DNS

### 2.4 Configurar formulario con Formspree

1. Abre: https://formspree.io
2. Click "Get Started" > Crear cuenta gratis
3. Click "New Form"
4. Nombre: "Celébralo pe Lista de Espera"
5. Copia tu Form ID (ej: `xpzvqwer`)
6. En tu archivo `landing.html`, reemplaza:
   ```
   action="https://formspree.io/f/TU_FORM_ID"
   ```
   Por:
   ```
   action="https://formspree.io/f/xpzvqwer"  (tu ID real)
   ```
7. Vuelve a subir la carpeta a Netlify

---

## PASO 3: CREAR REDES SOCIALES

### 3.1 Facebook - Pagina de Negocio

**Crear pagina:**
1. Abre: https://www.facebook.com/pages/create
2. Elige "Negocio o marca"
3. Nombre: `Celébralo pe - Locales para Eventos`
4. Categoria: `Servicio de planificacion de eventos`
5. Click "Crear pagina"

**Configurar:**
```
Nombre de usuario: @celebralope
Bio: Encuentra el local perfecto para tu evento en Sullana. Compara precios, ve fotos y reserva en minutos.
Ubicacion: Sullana, Piura, Peru
Telefono: [Tu WhatsApp]
Sitio web: https://celebralope-peru.netlify.app
Horario: Lun-Sab 9am-6pm
```

**Foto de perfil:** Logo Celébralo pe (crear en Canva)
**Foto de portada:** Collage de locales o imagen del hero

**Boton de accion:** "Registrarse" > Link a landing page

### 3.2 Instagram - Cuenta de Negocio

**Crear cuenta:**
1. Descargar Instagram o abrir web
2. Crear cuenta nueva
3. Usuario: `celebralo.peru`
4. Convertir a cuenta profesional: Configuracion > Cuenta > Cambiar a cuenta profesional > Empresa

**Configurar:**
```
Nombre: Celébralo pe
Bio:
🎉 Locales para eventos en Sullana
📍 Compara precios y disponibilidad
✨ Reserva en minutos
👇 Unete a la lista de espera
```

**Link en bio:** https://celebralope-peru.netlify.app

**Highlights sugeridos:**
- "Locales" - Fotos de locales
- "Tips" - Consejos para eventos
- "Nosotros" - Sobre Celébralo pe
- "FAQ" - Preguntas frecuentes

### 3.3 WhatsApp Business

**Descargar:**
- Android: Play Store > WhatsApp Business
- iPhone: App Store > WhatsApp Business

**Configurar perfil:**
```
Nombre: Celébralo pe
Categoria: Planificacion de eventos
Descripcion: Plataforma para encontrar locales de eventos en Sullana. Compara precios, ve fotos reales y reserva facil.
Direccion: Sullana, Piura
Horario: Lun-Sab 9:00-18:00
Email: [tu email]
Sitio web: https://celebralope-peru.netlify.app
```

**Mensaje de bienvenida:**
```
Hola! 👋 Gracias por contactar a Celébralo pe.

Somos la plataforma para encontrar locales de eventos en Sullana.

¿En que podemos ayudarte?
1️⃣ Buscar un local para mi evento
2️⃣ Publicar mi local en Celébralo pe
3️⃣ Ofrecer mis servicios (DJ, catering, etc)
4️⃣ Otra consulta

Responde con el numero de tu opcion.
```

**Mensaje de ausencia:**
```
Hola! Gracias por escribirnos.

En este momento no podemos responder, pero te contactaremos pronto.

Mientras tanto, puedes registrarte en nuestra lista de espera:
👉 https://celebralope-peru.netlify.app

¡Gracias por tu paciencia!
```

**Respuestas rapidas:**
1. `/gracias` - "¡Gracias por tu interes en Celébralo pe! Te mantendremos informado sobre nuestro lanzamiento."
2. `/landing` - "Registrate en nuestra lista de espera aqui: https://celebralope-peru.netlify.app"
3. `/local` - "¿Tienes un local para eventos? Registralo gratis aqui: [link]"

### 3.4 TikTok (Opcional)

**Crear cuenta:**
1. Descargar TikTok
2. Crear cuenta con email
3. Usuario: `celebralo.peru`

**Bio:**
```
🎉 Locales para eventos en Sullana
💡 Tips para organizar tu evento
📍 Piura, Peru
```

---

## PASO 4: MENSAJES PARA DIFUSION

### 4.1 Mensaje WhatsApp - Clientes (Encuesta)

**Mensaje personal:**
```
Hola [Nombre]! 👋

Estamos creando una plataforma para encontrar locales de eventos en Sullana y me encantaria tu opinion.

¿Podrias responder esta encuesta de 3 minutos? Tu respuesta nos ayuda mucho.

👉 [LINK ENCUESTA CLIENTES]

¡Gracias! 🙏
```

**Para grupos:**
```
Hola a todos! 👋

Estamos creando algo para facilitar la organizacion de eventos en Sullana y necesitamos su ayuda.

Si alguna vez organizaste un cumpleaños, matrimonio, XV años o cualquier evento, tu opinion es super valiosa.

📋 Encuesta (3 min): [LINK]

¡Gracias por apoyar! 🎉
```

### 4.2 Mensaje WhatsApp - Duenos de Locales

```
Hola! 👋

Soy [Tu nombre] y estamos lanzando Celébralo pe, una plataforma para conectar locales de eventos con clientes en Sullana.

Vi que tienes [nombre del local] y me gustaria invitarte a ser parte.

Beneficios:
✅ Mas visibilidad para tu local
✅ Reservas automaticas
✅ 0% comision los primeros 3 meses

¿Te gustaria saber mas? Solo toma 2 minutos:
👉 [LINK ENCUESTA DUENOS]

¡Gracias!
```

### 4.3 Mensaje WhatsApp - Proveedores

```
Hola! 👋

¿Ofreces servicios para eventos (DJ, catering, fotografia, decoracion)?

Estamos creando Celébralo pe, una plataforma donde organizadores de eventos podran encontrar y contratar servicios como el tuyo.

Nos ayudaria mucho tu opinion:
👉 [LINK ENCUESTA PROVEEDORES]

Solo toma 3 minutos. ¡Gracias! 🙏
```

### 4.4 Post Facebook - Lanzamiento

```
🚀 ¡ESTAMOS CREANDO ALGO INCREIBLE!

¿Alguna vez perdiste horas buscando un local para tu evento en Sullana?
¿Llamando de local en local preguntando precios?
¿Sin saber si estaba disponible en tu fecha?

Eso se acaba. 🎉

Estamos construyendo CELÉBRALO PE - la primera plataforma donde podras:

✅ Ver TODOS los locales de Sullana en un solo lugar
✅ Comparar precios y capacidades
✅ Ver fotos reales y reseñas
✅ Reservar en minutos

🎁 Los primeros 200 en registrarse tendran acceso anticipado GRATIS + beneficios exclusivos.

👉 Unete a la lista de espera: [LINK LANDING]

¿Conoces a alguien que organiza eventos? ¡Etiquetalo! 👇

#EventosSullana #Celébralo pePeru #LocalesParaEventos
```

### 4.5 Historia Instagram - Lanzamiento

**Slide 1:**
```
¿Cansado de buscar locales para eventos?

😫 Llamar local por local
😫 No saber precios
😫 Fotos que no son reales

Nosotros tambien.
```

**Slide 2:**
```
Por eso creamos CELÉBRALO PE 🎉

✨ Todos los locales de Sullana
✨ Precios claros
✨ Fotos reales
✨ Reserva facil
```

**Slide 3:**
```
Se el primero en probarlo 🚀

Link en bio 👆

Los primeros 200 tienen
acceso anticipado GRATIS
```

### 4.6 Lista de contactos para encuestas

**Meta: 30 respuestas por encuesta**

**Clientes (organizadores):**
- [ ] Familiares que han organizado eventos
- [ ] Amigos que se casaron recientemente
- [ ] Papas de companeros (cumpleanos de ninos)
- [ ] Grupos de Facebook de Sullana
- [ ] Grupos de WhatsApp de vecinos/amigos

**Duenos de locales:**
- [ ] Buscar en Facebook "salon de eventos Sullana"
- [ ] Buscar en Google Maps "locales para eventos"
- [ ] Preguntar a conocidos que conozcan duenos
- [ ] Visitar locales personalmente

**Proveedores:**
- [ ] Buscar en Facebook/Instagram: DJ Sullana, Catering Sullana
- [ ] Preguntar a quienes han organizado eventos
- [ ] Grupos de proveedores de eventos

---

## CHECKLIST DE LANZAMIENTO

### Hoy:
- [ ] Crear 3 encuestas en Google Forms
- [ ] Crear cuenta en Formspree
- [ ] Actualizar landing.html con Form ID
- [ ] Subir prototipo a Netlify
- [ ] Verificar que el formulario funciona

### Manana:
- [ ] Crear pagina de Facebook
- [ ] Crear cuenta de Instagram
- [ ] Configurar WhatsApp Business
- [ ] Disenar logo en Canva (si no tienes)
- [ ] Publicar primer post anunciando el lanzamiento

### Esta semana:
- [ ] Enviar encuesta de clientes a 30+ personas
- [ ] Enviar encuesta de duenos a 10+ locales
- [ ] Enviar encuesta de proveedores a 10+ proveedores
- [ ] Publicar contenido diario en redes
- [ ] Responder todos los comentarios/mensajes

### Proxima semana:
- [ ] Analizar resultados de encuestas
- [ ] Contactar a quienes dejaron datos
- [ ] Ajustar estrategia segun feedback
- [ ] Empezar a registrar locales reales

---

## LINKS IMPORTANTES (Completar)

```
LANDING PAGE:    https://celebralope-peru.netlify.app
ENCUESTA 1:      https://forms.gle/_______________
ENCUESTA 2:      https://forms.gle/_______________
ENCUESTA 3:      https://forms.gle/_______________
FACEBOOK:        https://facebook.com/celebralope
INSTAGRAM:       https://instagram.com/celebralo.peru
WHATSAPP:        https://wa.me/51_________
```
