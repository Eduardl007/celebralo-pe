# PROMPT BASE - DESARROLLO DE APLICACIONES WEB

> **Documento de referencia obligatorio** para la creación de plataformas web, aplicaciones y landing pages.
> Este archivo debe ser consultado SIEMPRE antes de iniciar cualquier desarrollo.

---

## TABLA DE CONTENIDO

1. [Arquitecturas Disponibles](#arquitecturas-disponibles)
2. [Frontend - React 19 + MUI](#frontend---react-19--mui)
3. [Backend - Node.js + Express](#backend---nodejs--express)
4. [Landing Pages - HTML/CSS/JS](#landing-pages---htmlcssjs)
5. [Checklist Pre-Desarrollo](#checklist-pre-desarrollo)

---

## ARQUITECTURAS DISPONIBLES

### Opción A: Frontend + Firebase (Sin Backend)
```
Usar cuando:
- MVP o prototipos rápidos
- Aplicaciones pequeñas/medianas
- No se requiere lógica de negocio compleja en servidor
- Presupuesto limitado de infraestructura

Stack:
├── React 19 + MUI + Vite
├── Firebase Auth (autenticación)
├── Firestore (base de datos)
├── Firebase Storage (archivos)
└── Firebase Hosting (deploy)
```

### Opción B: Frontend + Backend + MongoDB
```
Usar cuando:
- Aplicaciones empresariales
- Lógica de negocio compleja
- Integraciones con servicios externos
- Control total sobre la infraestructura
- Escalabilidad personalizada

Stack:
├── Frontend: React 19 + MUI + Vite
├── Backend: Node.js + Express
├── Database: MongoDB + Mongoose
└── Deploy: VPS / Cloud (AWS, GCP, DigitalOcean)
```

### Opción C: Landing Page Estática
```
Usar cuando:
- Páginas informativas
- Marketing y conversión
- Portafolios
- Presentación de productos/servicios

Stack:
├── HTML5 semántico
├── CSS3 / Tailwind CSS
├── JavaScript vanilla / GSAP
├── Three.js (si requiere 3D)
└── Deploy: Netlify / Vercel / GitHub Pages
```

---

## FRONTEND - REACT 19 + MUI

### Estructura de Carpetas

```
src/
├── app/                          # Configuración global de la app
│   ├── App.jsx                   # Componente raíz
│   ├── AppProviders.jsx          # Wrapper de todos los providers
│   └── routes.jsx                # Configuración de rutas principales
│
├── config/                       # Configuraciones
│   ├── constants.js              # Constantes globales
│   ├── endpoints.js              # URLs de API
│   ├── firebase.js               # Config Firebase (si aplica)
│   └── theme.js                  # Tema MUI personalizado
│
├── context/                      # Contextos globales
│   ├── AuthContext.jsx           # Contexto de autenticación
│   ├── ThemeContext.jsx          # Contexto de tema (dark/light)
│   └── NotificationContext.jsx   # Contexto de notificaciones/alerts
│
├── hooks/                        # Custom hooks globales
│   ├── useAuth.js                # Hook de autenticación
│   ├── useFetch.js               # Hook para peticiones HTTP
│   ├── useLocalStorage.js        # Hook para localStorage
│   └── useDebounce.js            # Hook para debounce
│
├── services/                     # Servicios/API calls
│   ├── api.js                    # Instancia axios configurada
│   ├── authService.js            # Servicios de autenticación
│   └── storageService.js         # Servicios de almacenamiento
│
├── components/                   # Componentes compartidos/globales
│   ├── ui/                       # Componentes UI reutilizables
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── index.js
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Form/
│   │   └── Loading/
│   │
│   ├── layout/                   # Componentes de layout
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── MainLayout.jsx
│   │
│   └── common/                   # Componentes comunes
│       ├── ProtectedRoute.jsx
│       ├── SEO.jsx
│       └── ErrorBoundary.jsx
│
├── features/                     # Módulos/Features (cada uno autocontenido)
│   │
│   ├── auth/                     # Feature: Autenticación
│   │   ├── components/           # Componentes propios del módulo
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── pages/                # Páginas del módulo
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── index.js
│   │   ├── hooks/                # Hooks propios del módulo
│   │   │   └── useLogin.js
│   │   ├── services/             # Servicios propios del módulo
│   │   │   └── authApi.js
│   │   ├── utils/                # Utilidades propias del módulo
│   │   │   └── validators.js
│   │   ├── routes.jsx            # Rutas del módulo
│   │   └── index.js              # Exportaciones del módulo
│   │
│   ├── dashboard/                # Feature: Dashboard
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── routes.jsx
│   │   └── index.js
│   │
│   ├── users/                    # Feature: Gestión de usuarios
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── routes.jsx
│   │   └── index.js
│   │
│   └── [feature-name]/           # Otros módulos según necesidad
│
├── utils/                        # Utilidades globales
│   ├── helpers.js                # Funciones helper
│   ├── formatters.js             # Formateadores (fecha, moneda, etc.)
│   ├── validators.js             # Validaciones
│   └── storage.js                # Manejo de storage
│
├── assets/                       # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/                       # Estilos globales
│   ├── global.css
│   └── variables.css
│
├── main.jsx                      # Entry point
└── index.html
```

### Configuración Base

#### package.json
```json
{
  "name": "app-name",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "@mui/material": "^6.0.0",
    "@mui/icons-material": "^6.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0",
    "axios": "^1.7.0",
    "react-helmet-async": "^2.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^6.0.0",
    "eslint": "^9.0.0"
  }
}
```

#### AppProviders.jsx
```jsx
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import theme from '@/config/theme';

export const AppProviders = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};
```

#### Componente SEO Base
```jsx
// components/common/SEO.jsx
import { Helmet } from 'react-helmet-async';

export const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website'
}) => {
  const siteTitle = 'Mi Aplicación';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return (
    <Helmet>
      {/* Básico */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
};
```

#### Rutas Modulares
```jsx
// app/routes.jsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import Loading from '@/components/ui/Loading';

// Lazy loading de features
const AuthRoutes = lazy(() => import('@/features/auth/routes'));
const DashboardRoutes = lazy(() => import('@/features/dashboard/routes'));
const UsersRoutes = lazy(() => import('@/features/users/routes'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
            <Route path="/users/*" element={<UsersRoutes />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
```

#### Ejemplo de Feature Module (Auth)
```jsx
// features/auth/routes.jsx
import { Routes, Route } from 'react-router-dom';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  );
};

export default AuthRoutes;
```

### Alias de Importación (vite.config.js)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
      '@config': path.resolve(__dirname, './src/config'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
```

---

## BACKEND - NODE.JS + EXPRESS

### Estructura de Carpetas

```
src/
├── config/                       # Configuraciones
│   ├── database.js               # Conexión MongoDB
│   ├── environment.js            # Variables de entorno
│   └── constants.js              # Constantes
│
├── middlewares/                  # Middlewares
│   ├── errorHandler.js           # Middleware centralizado de errores
│   ├── validateSchema.js         # Middleware validación JOI
│   ├── auth.js                   # Middleware autenticación JWT
│   ├── rateLimiter.js            # Rate limiting
│   └── security.js               # Headers de seguridad
│
├── exceptions/                   # Excepciones personalizadas
│   ├── AppException.js           # Clase base de excepciones
│   ├── ValidationException.js    # Errores de validación
│   ├── AuthException.js          # Errores de autenticación
│   ├── NotFoundExeption.js       # Recursos no encontrados
│   └── index.js                  # Exportaciones
│
├── modules/                      # Módulos de la aplicación
│   │
│   ├── auth/                     # Módulo: Autenticación
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.routes.js
│   │   ├── auth.schema.js        # Schemas JOI
│   │   └── index.js
│   │
│   ├── users/                    # Módulo: Usuarios
│   │   ├── user.controller.js
│   │   ├── user.service.js
│   │   ├── user.routes.js
│   │   ├── user.schema.js
│   │   ├── user.model.js         # Modelo Mongoose
│   │   └── index.js
│   │
│   └── [module-name]/            # Otros módulos
│
├── utils/                        # Utilidades
│   ├── asyncHandler.js           # Wrapper para async/await
│   ├── response.js               # Formateador de respuestas
│   ├── logger.js                 # Logger
│   └── helpers.js                # Funciones helper
│
├── routes/                       # Rutas principales
│   └── index.js                  # Router principal
│
├── app.js                        # Configuración Express
└── server.js                     # Entry point
```

### Sistema Centralizado de Errores

#### Clase Base de Excepciones
```javascript
// exceptions/AppException.js
class AppException extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppException;
```

#### Excepciones Específicas
```javascript
// exceptions/index.js
const AppException = require('./AppException');

class ValidationException extends AppException {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class AuthException extends AppException {
  constructor(message = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenException extends AppException {
  constructor(message = 'Acceso denegado') {
    super(message, 403, 'FORBIDDEN');
  }
}

class NotFoundException extends AppException {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
  }
}

class ConflictException extends AppException {
  constructor(message = 'Conflicto con recurso existente') {
    super(message, 409, 'CONFLICT');
  }
}

class RateLimitException extends AppException {
  constructor(message = 'Demasiadas solicitudes') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

module.exports = {
  AppException,
  ValidationException,
  AuthException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  RateLimitException
};
```

#### Middleware Centralizado de Errores
```javascript
// middlewares/errorHandler.js
const { AppException } = require('../exceptions');

const errorHandler = (err, req, res, next) => {
  // Log del error (en producción usar servicio de logging)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Error de validación JOI
  if (err.isJoi) {
    const details = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Error de validación',
      errors: details
    });
  }

  // Error de MongoDB - Duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      code: 'DUPLICATE_ERROR',
      message: `El ${field} ya existe`,
      field
    });
  }

  // Error de MongoDB - Validación
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Error de validación',
      errors
    });
  }

  // Error de MongoDB - CastError (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      code: 'INVALID_ID',
      message: 'ID inválido'
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      code: 'TOKEN_EXPIRED',
      message: 'Token expirado'
    });
  }

  // Error personalizado (AppException)
  if (err instanceof AppException) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_JSON',
      message: 'JSON inválido en el body'
    });
  }

  // Error genérico (500)
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message
  });
};

module.exports = errorHandler;
```

#### Middleware de Validación JOI
```javascript
// middlewares/validateSchema.js
const validateSchema = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      error.isJoi = true;
      return next(error);
    }

    req[property] = value;
    next();
  };
};

module.exports = validateSchema;
```

#### AsyncHandler (Elimina try-catch en controllers)
```javascript
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```

### Rate Limiting Configurable
```javascript
// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');
const { RateLimitException } = require('../exceptions');

// Configuraciones según modelo de negocio
const RATE_LIMITS = {
  // API general - aplicaciones estándar
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100                   // 100 requests por ventana
  },

  // E-commerce / Alta demanda
  ecommerce: {
    windowMs: 15 * 60 * 1000,
    max: 300
  },

  // APIs internas / B2B
  enterprise: {
    windowMs: 15 * 60 * 1000,
    max: 1000
  },

  // Login/Auth - más restrictivo
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 10                    // 10 intentos
  },

  // Endpoints sensibles (cambio password, etc.)
  sensitive: {
    windowMs: 60 * 60 * 1000,  // 1 hora
    max: 5
  }
};

const createRateLimiter = (type = 'standard') => {
  const config = RATE_LIMITS[type] || RATE_LIMITS.standard;

  return rateLimit({
    ...config,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new RateLimitException());
    },
    keyGenerator: (req) => {
      return req.ip || req.headers['x-forwarded-for'] || 'unknown';
    }
  });
};

module.exports = { createRateLimiter, RATE_LIMITS };
```

### Middleware de Seguridad
```javascript
// middlewares/security.js
const helmet = require('helmet');

const securityMiddleware = () => {
  return [
    // Helmet - Headers de seguridad
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),

    // Prevenir XSS
    helmet.xssFilter(),

    // Ocultar X-Powered-By
    helmet.hidePoweredBy(),

    // Prevenir clickjacking
    helmet.frameguard({ action: 'deny' }),

    // HSTS
    helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }),

    // Prevenir MIME sniffing
    helmet.noSniff(),
  ];
};

module.exports = securityMiddleware;
```

### Ejemplo de Controller Limpio
```javascript
// modules/users/user.controller.js
const asyncHandler = require('../../utils/asyncHandler');
const userService = require('./user.service');
const { NotFoundException } = require('../../exceptions');

// Sin try-catch - los errores van al middleware
const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.findAll(req.query);
  res.json({ success: true, data: users });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);

  if (!user) {
    throw new NotFoundException('Usuario');
  }

  res.json({ success: true, data: user });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);

  if (!user) {
    throw new NotFoundException('Usuario');
  }

  res.json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.delete(req.params.id);
  res.status(204).send();
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
```

### App.js Completo
```javascript
// app.js
const express = require('express');
const securityMiddleware = require('./middlewares/security');
const { createRateLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// Seguridad (sin CORS por ahora)
app.use(securityMiddleware());

// Rate limiting global
app.use(createRateLimiter('standard'));

// Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rutas
app.use('/api/v1', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware de errores (SIEMPRE al final)
app.use(errorHandler);

module.exports = app;
```

---

## LANDING PAGES - HTML/CSS/JS

### Stack Recomendado 2025

```
Tecnologías Base:
├── HTML5 semántico (accesibilidad + SEO)
├── CSS3 / Tailwind CSS v4
├── JavaScript vanilla o con bundler (Vite)
│
Animaciones:
├── GSAP + ScrollTrigger (scroll animations)
├── Lottie (micro-animaciones livianas)
├── CSS @scroll-timeline (nativo, sin JS)
│
3D (cuando aplique):
├── Three.js + React Three Fiber
├── Spline (diseño 3D sin código)
├── WebGL / WebGPU
│
Optimización:
├── Lazy loading de assets pesados
├── Preload de recursos críticos
├── Imágenes WebP/AVIF
└── Core Web Vitals optimizados
```

### Estructura de Proyecto Landing Page

```
landing/
├── index.html
├── css/
│   ├── styles.css          # Estilos principales
│   ├── animations.css      # Animaciones CSS
│   └── responsive.css      # Media queries
│
├── js/
│   ├── main.js             # JavaScript principal
│   ├── animations.js       # Lógica de animaciones GSAP
│   └── three-scene.js      # Escena 3D (si aplica)
│
├── assets/
│   ├── images/
│   ├── videos/
│   ├── models/             # Modelos 3D (.glb, .gltf)
│   └── lottie/             # Animaciones Lottie (.json)
│
└── fonts/
```

### Template HTML Base con SEO
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <!-- SEO Básico -->
  <title>Título Principal | Marca</title>
  <meta name="description" content="Descripción concisa de 150-160 caracteres que describe el contenido de la página.">
  <meta name="keywords" content="palabra1, palabra2, palabra3">
  <meta name="author" content="Nombre/Empresa">
  <meta name="robots" content="index, follow">

  <!-- Open Graph (Facebook, LinkedIn) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://ejemplo.com/">
  <meta property="og:title" content="Título para redes sociales">
  <meta property="og:description" content="Descripción para compartir en redes.">
  <meta property="og:image" content="https://ejemplo.com/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="es_ES">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://ejemplo.com/">
  <meta name="twitter:title" content="Título para Twitter">
  <meta name="twitter:description" content="Descripción para Twitter.">
  <meta name="twitter:image" content="https://ejemplo.com/twitter-image.jpg">

  <!-- Canonical -->
  <link rel="canonical" href="https://ejemplo.com/">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Preconnect para recursos externos -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Preload recursos críticos -->
  <link rel="preload" href="/fonts/font-principal.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Estilos -->
  <link rel="stylesheet" href="css/styles.css">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Título de la Página",
    "description": "Descripción de la página",
    "url": "https://ejemplo.com/",
    "publisher": {
      "@type": "Organization",
      "name": "Nombre de la Empresa",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ejemplo.com/logo.png"
      }
    }
  }
  </script>
</head>
<body>
  <header>
    <nav aria-label="Navegación principal">
      <!-- Navegación -->
    </nav>
  </header>

  <main>
    <!-- Hero Section -->
    <section id="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Título Principal H1</h1>
      <!-- Contenido hero -->
    </section>

    <!-- Más secciones -->
  </main>

  <footer>
    <!-- Footer -->
  </footer>

  <!-- Scripts al final -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js" type="module"></script>
</body>
</html>
```

### Animaciones con GSAP + ScrollTrigger
```javascript
// js/animations.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Animación de fade-in al hacer scroll
export const initScrollAnimations = () => {
  // Elementos que aparecen con fade
  gsap.utils.toArray('.fade-in').forEach(element => {
    gsap.from(element, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Parallax en hero
  gsap.to('.hero-bg', {
    yPercent: 50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Timeline para sección de features
  const featuresTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.features',
      start: 'top center',
      toggleActions: 'play none none reverse'
    }
  });

  featuresTl
    .from('.feature-card', {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
};

// Respetar preferencias de movimiento reducido
export const initAnimations = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    initScrollAnimations();
  }
};
```

### Tendencias Clave 2025

1. **Scroll Storytelling**: Contenido que se revela cinematográficamente al scrollear
2. **Micro-interacciones**: Feedback visual sutil en hover, click, scroll
3. **3D Sutil**: Elementos 3D livianos que responden al mouse/scroll
4. **AI-Driven Motion**: Animaciones generadas con herramientas AI
5. **WebGPU**: Próxima generación de gráficos web (más rápido que WebGL)
6. **CSS @scroll-timeline**: Animaciones nativas sin JavaScript
7. **Diseño Minimalista con Movimiento**: Layouts limpios con animaciones elegantes

---

## CHECKLIST PRE-DESARROLLO

### Antes de Iniciar Cualquier Proyecto

```markdown
## 1. Definir Arquitectura
- [ ] ¿Qué tipo de proyecto es? (App completa / Landing page)
- [ ] ¿Requiere backend? (Lógica compleja, integraciones)
- [ ] ¿Firebase es suficiente o necesito MongoDB + Node?
- [ ] ¿Cuál es el volumen esperado de usuarios?

## 2. Frontend
- [ ] Crear estructura de carpetas según plantilla
- [ ] Configurar Vite + alias de importación
- [ ] Instalar dependencias base (React 19, MUI, Router, Axios)
- [ ] Configurar tema MUI personalizado
- [ ] Implementar SEO base con react-helmet-async
- [ ] Crear contextos globales (Auth, Theme, Notification)
- [ ] Implementar ProtectedRoute y ErrorBoundary

## 3. Backend (si aplica)
- [ ] Crear estructura de carpetas según plantilla
- [ ] Configurar middleware de errores centralizado
- [ ] Implementar excepciones personalizadas
- [ ] Configurar rate limiting según modelo de negocio
- [ ] Agregar middlewares de seguridad (helmet, sin cors inicial)
- [ ] Crear asyncHandler para eliminar try-catch
- [ ] Configurar validación con JOI

## 4. Landing Page (si aplica)
- [ ] Definir si requiere animaciones/3D
- [ ] Configurar SEO completo (meta tags, Open Graph, Schema)
- [ ] Implementar GSAP + ScrollTrigger si hay animaciones
- [ ] Optimizar Core Web Vitals
- [ ] Respetar prefers-reduced-motion
- [ ] Verificar accesibilidad (ARIA, semántica)

## 5. Seguridad General
- [ ] Variables de entorno protegidas
- [ ] Rate limiting configurado
- [ ] Headers de seguridad activos
- [ ] Validación de inputs en frontend y backend
- [ ] Sanitización de datos
- [ ] JWT con expiración adecuada (si aplica)
```

---

## REFERENCIAS Y RECURSOS

### Documentación Oficial
- [React 19](https://react.dev/)
- [Material UI v6](https://mui.com/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Firebase](https://firebase.google.com/docs)

### Animaciones y 3D
- [GSAP](https://gsap.com/)
- [Three.js](https://threejs.org/)
- [Spline](https://spline.design/)
- [Lottie](https://lottiefiles.com/)

### Inspiración Landing Pages
- [Awwwards - GSAP](https://www.awwwards.com/websites/gsap/)
- [Lapa Ninja - 3D Websites](https://www.lapa.ninja/category/3d-websites/)
- [Codrops](https://tympanus.net/codrops/)

---

> **Nota**: Este documento es una guía base. Adaptar según las necesidades específicas de cada proyecto.
> Última actualización: Noviembre 2025
