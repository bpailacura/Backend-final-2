# Sistema de Autenticación Híbrido con Node.js

API REST de autenticación híbrida que combina **login local** (email + contraseña) con **OAuth 2.0 vía GitHub**, utilizando JWT y sesiones persistentes en MongoDB.

---

## Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Passport.js** (Local Strategy + GitHub Strategy)
- **JWT** (jsonwebtoken)
- **bcryptjs**
- **express-session** + **connect-mongo**
- **express-validator**

---

## Estructura del Proyecto

```
auth-hybrid/
├── index.js                    ← Entry point
├── .env.example                ← Variables de entorno
├── config/
│   ├── db.js                   ← Conexión a MongoDB
│   └── passport.js             ← Estrategias Passport
├── models/
│   └── User.js                 ← Schema Mongoose
├── routes/
│   ├── auth.routes.js          ← Rutas públicas
│   └── protected.routes.js     ← Rutas privadas
├── controllers/
│   ├── auth.controller.js
│   └── protected.controller.js
└── middlewares/
    ├── verifyToken.js          ← Verificación JWT
    ├── checkRole.js            ← Control de acceso por rol
    └── validate.js             ← Validación de inputs
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/bpailacura/Backend-final-2.git
cd Backend-final-2

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editá .env con tus valores reales

# 4. Iniciar el servidor
node index.js
```

El servidor queda disponible en `http://localhost:3000`

---

## Variables de Entorno

```env
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/auth_hybrid

SESSION_SECRET=tu_session_secret_muy_largo_y_seguro
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro

GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/v1/auth/github/callback
```

Para el login con GitHub necesitás crear una OAuth App en [GitHub Developer Settings](https://github.com/settings/developers).

---

## Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Registro de usuario | — |
| POST | `/api/v1/auth/login` | Login local | — |
| GET | `/api/v1/auth/github` | Inicio flujo OAuth GitHub | — |
| GET | `/api/v1/auth/github/callback` | Callback OAuth | — |
| GET | `/api/v1/auth/session` | Consulta sesión activa | Sesión |
| POST | `/api/v1/auth/logout` | Cierre de sesión | JWT |
| GET | `/api/v1/profile` | Perfil del usuario | JWT |
| GET | `/api/v1/admin` | Panel de administración | JWT + rol admin |

---

## Autenticación

El sistema soporta dos mecanismos en paralelo:

**JWT** — generado al hacer login, enviado en cookie `httpOnly` y en el body de la respuesta. Se usa para proteger rutas privadas via `verifyToken` middleware.

**Sesión** — gestionada por Passport + connect-mongo, necesaria para el flujo OAuth de GitHub.

Las rutas protegidas aceptan el token tanto desde la cookie como desde el header `Authorization: Bearer <token>`.

---

## Seguridad

- Contraseñas hasheadas con **bcrypt** (10 rondas), nunca almacenadas en texto plano
- Cookie `authToken` con flags **httpOnly** y **sameSite: Lax** para mitigar XSS y CSRF
- Flag **secure** activa solo en producción (requiere HTTPS)
- Control de acceso por rol con middleware `checkRole`
- JWT con expiración de **1 hora**

---

## Documentación Técnica

La documentación completa del proyecto (arquitectura, implementación, decisiones de seguridad y evidencia de funcionamiento) está en el archivo `ProyectoFinal_Autenticacion_Hibrida.docx` incluido en este repositorio.
