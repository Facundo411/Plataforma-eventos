# Plataforma de Eventos

## Descripción

Plataforma de Eventos es una API REST desarrollada con Node.js y Express que permite gestionar usuarios y eventos. Utiliza MongoDB como base de datos e implementa autenticación mediante Passport.js, JWT y cookies, junto con autorización basada en roles (RBAC).

El proyecto separa rutas, controladores, servicios, repositorios y middlewares para facilitar el mantenimiento y la escalabilidad.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para desarrollar el servidor y las rutas.
- **MongoDB:** base de datos NoSQL.
- **Mongoose:** modelado y gestión de datos.
- **JWT (JSON Web Token):** generación y validación de tokens.
- **bcrypt:** hash y verificación de contraseñas.
- **cookie-parser:** lectura de cookies.
- **dotenv:** configuración mediante variables de entorno.
- **Passport.js:** autenticación de usuarios.
- **passport-custom:** estrategias personalizadas de registro, login y usuario actual.

## Instalación y configuración

### 1. Instalar dependencias

Clonar el repositorio y ejecutar:

```bash
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
MONGO_URL=tu_mongo_url
JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

Reemplazar los valores de ejemplo por los correspondientes a tu entorno. No subir el archivo `.env` al repositorio.

### 3. Iniciar el servidor

```bash
npm run dev
```

El endpoint `/api/health` permite comprobar que el servidor está activo.

## Autenticación

La autenticación utiliza JWT almacenados en una cookie llamada `currentUser`, configurada como `httpOnly`.

- **Registro:** valida los datos, verifica que el email no esté registrado y crea un usuario con contraseña protegida mediante bcrypt.
- **Login:** valida las credenciales y genera un JWT.
- **Usuario actual:** valida el token y devuelve los datos básicos del usuario autenticado.
- **Logout:** elimina la cookie de autenticación.

El registro público no permite elegir el rol mediante el body. Los usuarios nuevos reciben el rol `user` por defecto.

## Roles y autorización (RBAC)

El sistema utiliza tres roles:

- **user:** puede consultar eventos publicados.
- **organizer:** puede consultar eventos publicados, crear eventos y modificar o publicar sus propios eventos.
- **admin:** puede consultar eventos publicados, crear eventos, modificar y publicar cualquier evento y consultar todos los usuarios.

### Matriz de permisos

| Acción | user | organizer | admin |
|---|:---:|:---:|:---:|
| Consultar eventos publicados | Sí | Sí | Sí |
| Crear eventos | No | Sí | Sí |
| Modificar eventos propios | No | Sí | Sí |
| Modificar cualquier evento | No | No | Sí |
| Publicar eventos propios | No | Sí | Sí |
| Publicar cualquier evento | No | No | Sí |
| Consultar todos los usuarios | No | No | Sí |

El campo `role` del modelo `User` admite los valores `user`, `organizer` y `admin`, y tiene como valor predeterminado `user`.

## Middlewares de autenticación y autorización

La autorización está separada de las rutas mediante dos middlewares reutilizables:

- `auth.middleware.js`: lee el JWT desde la cookie `currentUser`, verifica su validez y carga la información del usuario en `req.user`.
- `authorize.middleware.js`: recibe los roles permitidos como parámetros y compara esos roles con `req.user.role`.

Las rutas protegidas ejecutan primero la autenticación y luego la autorización. Por ejemplo:

```js
authenticate,
authorize("organizer", "admin")
```

### Diferencia entre 401 y 403

- **401 Unauthorized:** no existe una sesión válida; por ejemplo, falta la cookie o el JWT es inválido o expiró.
- **403 Forbidden:** existe una sesión válida, pero el rol no tiene permiso para realizar la acción.

Otros códigos relevantes:

- **400 Bad Request:** datos inválidos o identificador de evento con formato incorrecto.
- **404 Not Found:** el evento solicitado no existe.
- **409 Conflict:** el email ya está registrado.
- **500 Internal Server Error:** error interno inesperado del servidor.

## Endpoints principales

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/health` | Verifica el estado del servidor | Público |
| GET | `/api/events` | Consulta eventos publicados | Público; devuelve solo eventos publicados |
| POST | `/api/events` | Crea un evento | `organizer`, `admin` |
| PATCH | `/api/events/:id` | Modifica un evento | `organizer` propietario o `admin` |
| PATCH | `/api/events/:id/publish` | Publica un evento | `organizer` propietario o `admin` |
| POST | `/api/sessions/register` | Registra un usuario | Público |
| POST | `/api/sessions/login` | Inicia sesión | Público |
| GET | `/api/sessions/current` | Consulta el usuario autenticado | Autenticado |
| POST | `/api/sessions/logout` | Cierra la sesión | Cierre de cookie |
| GET | `/api/users` | Consulta todos los usuarios sin incluir contraseñas | `admin` |

## Propiedad de los eventos

Cada evento guarda una referencia al usuario que lo creó mediante el campo `organizer`.

Al modificar o publicar un evento, la API verifica que:

- El usuario autenticado sea el propietario del evento; o
- El usuario tenga el rol `admin`, que permite operar sobre cualquier evento.

El identificador del organizador se obtiene de `req.user`, no del body enviado por el cliente.

Los eventos nuevos tienen `published: false` por defecto. El listado de eventos devuelve únicamente los que están publicados.

## Estructura del proyecto

- `src/config/`: configuración de la aplicación, base de datos y Passport.js.
- `src/controllers/`: manejo de solicitudes y respuestas HTTP.
- `src/dao/`: acceso a datos.
- `src/middlewares/`: autenticación y autorización.
- `src/models/`: esquemas de MongoDB.
- `src/repositories/`: operaciones de acceso a datos.
- `src/routes/`: definición de endpoints.
- `src/services/`: lógica de negocio.
- `src/utils/`: utilidades, como JWT y hash de contraseñas.
- `src/app.js`: configuración de Express y registro de rutas.
- `src/server.js`: inicio del servidor.

## Seguridad

- Las contraseñas se almacenan mediante hash con bcrypt.
- Los JWT tienen un tiempo de expiración configurable.
- La cookie de autenticación usa `httpOnly`.
- Los permisos se verifican en el backend mediante middlewares.
- Las rutas de modificación y publicación verifican la propiedad del evento.
- La consulta administrativa excluye las contraseñas.
- Las variables sensibles se almacenan en `.env`, que no debe subirse al repositorio.

## Autor

Facundo Veliz