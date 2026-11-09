# Plataforma de Eventos

## Descripción

Plataforma de Eventos es una API REST desarrollada con **Node.js y Express** para gestionar usuarios, eventos e inscripciones.

Utiliza MongoDB, Passport.js, JWT, cookies y autorización basada en roles (RBAC).

El proyecto está organizado siguiendo una arquitectura por capas:
rutas → controladores → servicios → repositorios → DAOs → modelos,
con DTOs para controlar los datos expuestos en las respuestas.

## Tecnologías utilizadas

- **Node.js y Express:** servidor y API REST.
- **MongoDB y Mongoose:** base de datos y modelos.
- **Passport.js y passport-custom:** autenticación.
- **JWT y bcrypt:** autenticación y protección de contraseñas.
- **cookie-parser y dotenv:** cookies y variables de entorno.
- **Nodemailer:** envío de correos electrónicos.

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env`:

```env
PORT=8080
MONGO_URL=mi_mongo_url
JWT_SECRET=mi_jwt_secret
JWT_EXPIRES_IN=1h
NODE_ENV=development

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=mi_correo@gmail.com
MAIL_PASS=mi_clave_de_aplicacion
MAIL_FROM=mi_correo@gmail.com
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

- **user:** puede consultar eventos e inscribirse.
- **organizer:** puede crear y modificar sus eventos y consultar sus inscripciones.
- **admin:** puede administrar eventos y consultar usuarios y tickets.

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

- `draft`: borrador.
- `published`: publicado.
- `cancelled`: cancelado.
- `finished`: finalizado.

### Validaciones

- No se permiten eventos con fechas pasadas.
- La capacidad debe ser mayor a cero y el precio no puede ser negativo.
- No se pueden publicar eventos pasados ni modificar eventos cancelados.
- Los eventos cancelados permanecen en la base de datos.

## Gestión de tickets e inscripciones

Cada ticket contiene referencias al usuario y al evento, estado, cantidad de entradas, código de reserva y fechas de creación y cancelación.

### Estados disponibles

- `confirmed`: inscripción confirmada.
- `pending`: inscripción pendiente.
- `cancelled`: inscripción cancelada.

### Validaciones

- El evento debe existir y estar publicado.
- La cantidad debe ser un número entero mayor a cero.
- No se puede superar la capacidad disponible.
- Se evitan inscripciones duplicadas para un mismo usuario y evento.
- Las inscripciones canceladas liberan los cupos y no se eliminan de la base de datos.

### Envío de correos

Nodemailer envía un correo de confirmación con el nombre del evento, la cantidad de entradas y el código de reserva.

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

### Tickets e inscripciones

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/events/:eid/tickets` | Crear inscripción | Autenticado |
| GET | `/api/tickets/my-tickets` | Consultar mis inscripciones | Autenticado |
| GET | `/api/events/:eid/tickets` | Consultar tickets del evento | organizer propietario, admin |
| PATCH | `/api/tickets/:tid/cancel` | Cancelar inscripción | Propietario, admin |

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

Los middlewares `authenticate` y `authorize` verifican la identidad y los permisos del usuario.

El organizador se asigna automáticamente desde `req.user` y solo puede administrar sus propios eventos. Los usuarios pueden gestionar sus propias inscripciones, mientras que los administradores tienen permisos generales.

## Códigos HTTP

- **200:** operación exitosa.
- **201:** recurso creado.
- **400:** datos inválidos o reglas de negocio incumplidas.
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
- `app.js` y `server.js`: configuración e inicio del servidor.
- `dao/`: acceso directo a los modelos de MongoDB.
- `repositories/`: capa de acceso a datos utilizada por los servicios.
- `dtos/`: objetos para controlar y filtrar los datos enviados al cliente.

## Arquitectura

El proyecto utiliza una arquitectura por capas:

- **DAO:** única capa que interactúa directamente con los modelos de Mongoose.
- **Repository:** utiliza los DAOs y proporciona métodos orientados al dominio.
- **Service:** contiene la lógica de negocio y utiliza únicamente los repositories.
- **Controller:** recibe las solicitudes HTTP, llama a los services y construye las respuestas.
- **DTO:** controla qué información se expone al cliente, evitando enviar datos sensibles como contraseñas.
- **Middleware:** gestiona autenticación, autorización y manejo de errores.

## Seguridad

- Contraseñas protegidas con bcrypt.
- JWT y cookies `httpOnly`.
- Control de acceso mediante roles.
- Verificación de propiedad de eventos y tickets.
- Variables sensibles almacenadas en `.env`.

## Autor

Facundo Veliz