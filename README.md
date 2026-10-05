# Plataforma de Eventos e Inscripciones

API REST desarrollada con Node.js y Express para una plataforma de venta de entradas para eventos musicales.

## Temática

La plataforma está orientada a la publicación de eventos musicales y la gestión de usuarios para recitales, festivales y otros eventos.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- bcrypt
- dotenv
- JavaScript
- ESM

## Instalación

```bash
git clone URL_DE_TU_REPOSITORIO
cd Plataforma-eventos
npm install
```

Crear `.env` a partir de `.env.example`:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=tu_mongo_url
JWT_SECRET=tu_jwt_secret
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

Para desarrollo:

```bash
npm run dev
```

## Endpoints

- `GET /api/health` — Estado del servidor.
- `GET /api/events` — Lista de eventos.
- `GET /api/sessions` — Estado inicial de sessions.
- `POST /api/sessions/register` — Registro de usuarios.

## Registro de usuarios

### POST `/api/sessions/register`

Permite registrar un nuevo usuario en la plataforma.

### Body

```json
{
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "Ana@Mail.com ",
    "password": "Secreta123"
}
```

Campos obligatorios:

- `first_name`
- `last_name`
- `email`
- `password`

El email se normaliza automáticamente eliminando espacios y convirtiéndolo a minúsculas.

La contraseña debe tener al menos 8 caracteres.

El campo `role` no se recibe desde el registro público. Los usuarios registrados reciben el rol `user` por defecto.

### Respuesta exitosa

```json
{
    "status": "success",
    "payload": {
        "first_name": "Ana",
        "last_name": "Pérez",
        "email": "ana@mail.com",
        "role": "user"
    }
}
```

La contraseña nunca se devuelve en la respuesta y se almacena utilizando bcrypt.

### Respuestas de error

- `400` — Campos faltantes, email inválido o contraseña demasiado corta.
- `409` — El email ya está registrado.

## Arquitectura

El proyecto utiliza una arquitectura en capas:

Routes → Controllers → Services → Repositories → DAO → Models → MongoDB

El hash de contraseñas se encuentra implementado en un helper reutilizable:

`src/utils/hash.js`

## Estructura

```text
src/
├── app.js
├── server.js
├── config/
│   └── db.js
├── routes/
│   ├── events.router.js
│   └── sessions.router.js
├── controllers/
│   ├── events.controller.js
│   └── sessions.controller.js
├── services/
│   ├── events.service.js
│   └── sessions.service.js
├── repositories/
│   ├── events.repository.js
│   ├── sessions.repository.js
│   └── users.repository.js
├── dao/
│   ├── .gitkeep
│   └── users.dao.js
├── models/
│   ├── User.js
│   ├── Event.js
│   └── Inscription.js
├── middlewares/
│   └── .gitkeep
└── utils/
    ├── .gitkeep
    └── hash.js
```

## Seguridad

- Las contraseñas nunca se almacenan en texto plano.
- Las contraseñas se protegen mediante bcrypt.
- La contraseña no se incluye en las respuestas del endpoint.
- El rol no puede ser definido por el usuario durante el registro público.
- El archivo `.env` no se incluye en el repositorio.

## Autor

Facundo Veliz