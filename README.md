# Plataforma de Eventos

## Descripción

Plataforma de Eventos es una API REST desarrollada con **Node.js y Express** para gestionar usuarios y eventos.

Utiliza MongoDB, autenticación mediante Passport.js, JWT y cookies, y autorización basada en roles (RBAC).

El proyecto está organizado en rutas, controladores, servicios, repositorios y middlewares.

## Tecnologías utilizadas

- **Node.js y Express:** servidor y API REST.
- **MongoDB y Mongoose:** base de datos y modelos.
- **Passport.js y passport-custom:** autenticación.
- **JWT:** generación y validación de tokens.
- **bcrypt:** protección de contraseñas.
- **cookie-parser:** manejo de cookies.
- **dotenv:** variables de entorno.

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env`:

```env
PORT=8080
MONGO_URL=tu_mongo_url
JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

### 3. Iniciar el servidor

```bash
npm run dev
```

El endpoint `/api/health` permite verificar el funcionamiento del servidor.

**Importante:** no subir `.env` ni `node_modules` a GitHub.

## Autenticación y roles

La autenticación utiliza JWT almacenados en una cookie `currentUser` con `httpOnly`.

El sistema permite registrar usuarios, iniciar sesión, consultar el usuario actual y cerrar sesión.

Existen tres roles:

- **user:** puede consultar eventos.
- **organizer:** puede crear y modificar sus propios eventos.
- **admin:** puede administrar eventos de cualquier organizador y consultar usuarios.

Los usuarios registrados públicamente reciben el rol `user` por defecto.

## Gestión de eventos

Cada evento contiene:

- `title`: título.
- `description`: descripción.
- `category`: categoría.
- `date`: fecha.
- `location`: ubicación.
- `capacity`: capacidad.
- `price`: precio.
- `status`: estado.
- `organizer`: usuario creador.

### Estados disponibles

- `draft`: borrador (estado inicial).
- `published`: publicado.
- `cancelled`: cancelado.
- `finished`: finalizado.

### Validaciones

- No se permiten eventos con fechas pasadas.
- La capacidad debe ser mayor a cero.
- El precio no puede ser negativo.
- No se pueden publicar eventos cuya fecha ya pasó.
- No se pueden modificar eventos cancelados.
- Los eventos cancelados permanecen en la base de datos.

## Endpoints

### Eventos

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/events` | Listar eventos | Público |
| GET | `/api/events/:id` | Obtener evento | Público |
| POST | `/api/events` | Crear evento | organizer, admin |
| PUT | `/api/events/:id` | Modificar evento | organizer propietario, admin |
| PATCH | `/api/events/:id/status` | Cambiar estado | organizer propietario, admin |

### Sesiones y usuarios

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/sessions/register` | Registro |
| POST | `/api/sessions/login` | Login |
| GET | `/api/sessions/current` | Usuario actual |
| POST | `/api/sessions/logout` | Logout |
| GET | `/api/users` | Listar usuarios (admin) |

## Filtros y paginación

El endpoint `GET /api/events` admite:

- `status`, `category`, `location`: filtros.
- `dateFrom`, `dateTo`: rango de fechas.
- `page`, `limit`: paginación.
- `sort`: ordenamiento.

Ejemplo:

```http
GET /api/events?category=workshop&page=1&limit=10&sort=date
```

La respuesta incluye `data`, `page`, `limit`, `total` y `totalPages`.

## Autorización

El organizador de cada evento se asigna automáticamente desde `req.user`.

Los middlewares `authenticate` y `authorize` verifican la identidad y los permisos del usuario.

Los organizadores solamente pueden modificar sus propios eventos. Los administradores pueden modificar cualquier evento, respetando las reglas de negocio.

### Códigos HTTP

- **200:** operación exitosa.
- **201:** recurso creado.
- **400:** datos inválidos.
- **401:** usuario no autenticado.
- **403:** permisos insuficientes.
- **404:** recurso no encontrado.
- **409:** conflicto de datos.
- **500:** error del servidor.

## Estructura del proyecto

- `config/`: configuración y conexión.
- `models/`: modelos de MongoDB.
- `routes/`: endpoints.
- `controllers/`: solicitudes y respuestas.
- `services/`: lógica de negocio.
- `repositories/`: acceso a datos.
- `middlewares/`: autenticación y permisos.
- `utils/`: funciones auxiliares.
- `app.js`: configuración de Express.
- `server.js`: inicio del servidor.

## Seguridad

- Contraseñas protegidas con bcrypt.
- Autenticación con JWT y cookies `httpOnly`.
- Control de acceso mediante roles.
- Verificación de propiedad de eventos.
- Variables sensibles almacenadas en `.env`.
- Contraseñas excluidas de las consultas administrativas.

## Autor

Facundo Veliz