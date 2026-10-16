# Plataforma de Eventos

## Descripción

Plataforma de Eventos es una API REST desarrollada con Node.js y Express que permite gestionar eventos y usuarios. El proyecto utiliza MongoDB como base de datos e implementa un sistema de autenticación mediante JWT y cookies para administrar las sesiones de los usuarios.

El objetivo es contar con una estructura organizada, separando las rutas, los controladores, los servicios y los repositorios para facilitar el mantenimiento y la escalabilidad de la aplicación.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para desarrollar el servidor y las rutas.
- **MongoDB:** base de datos NoSQL.
- **Mongoose:** herramienta para modelar y gestionar los datos.
- **JWT (JSON Web Token):** generación y validación de tokens de autenticación.
- **bcrypt:** permite generar hashes de contraseñas para almacenarlas de forma segura.
- **cookie-parser:** lectura y gestión de cookies.
- **dotenv:** administración de variables de entorno.
- **Passport.js:** middleware de autenticación para gestionar las estrategias de registro, inicio de sesión y usuario actual.
- **passport-custom:** permite implementar estrategias de autenticación personalizadas para validar usuarios y tokens JWT.

## Instalación y configuración

### 1. Instalar dependencias

Clonar el repositorio y ejecutar el siguiente comando dentro de la carpeta del proyecto:

```bash
npm install
```

### 2. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=8080
MONGO_URL=tu_mongo_url
JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

Reemplazar los valores de ejemplo por la configuración correspondiente. El archivo `.env` contiene información sensible y no debe subirse al repositorio.

### 3. Iniciar el servidor

```bash
npm run dev
```

El servidor se ejecutará en el puerto configurado. Se puede verificar su funcionamiento mediante el endpoint `/api/health`.

## Funcionalidades principales

- **Registro de usuarios:** utiliza la estrategia `register` de Passport.js para validar los datos, comprobar si el email ya está registrado y crear el usuario con la contraseña protegida mediante bcrypt.
- **Inicio de sesión:** utiliza la estrategia `login` de Passport.js para validar las credenciales y generar un token JWT almacenado en una cookie `httpOnly`.
- **Autenticación con JWT:** genera tokens para identificar a los usuarios autenticados.
- **Gestión de cookies:** almacena el token en una cookie `httpOnly`.
- **Usuario actual:** utiliza la estrategia `current` de Passport.js para validar el token JWT y consultar los datos básicos del usuario autenticado.
- **Cierre de sesión:** elimina la cookie de autenticación.
- **Consulta de eventos:** permite obtener los eventos disponibles a través de la API.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica el estado del servidor. |
| GET | `/api/events` | Obtiene la lista de eventos. |
| POST | `/api/sessions/register` | Registra un usuario nuevo. |
| POST | `/api/sessions/login` | Inicia sesión y genera la cookie de autenticación. |
| GET | `/api/sessions/current` | Obtiene los datos del usuario autenticado. |
| POST | `/api/sessions/logout` | Cierra la sesión del usuario. |

### Respuestas de error de autenticación

- **400 Bad Request:** datos de registro inválidos o campos obligatorios faltantes.
- **401 Unauthorized:** credenciales incorrectas o usuario no autenticado.
- **409 Conflict:** el email ingresado ya está registrado.
- **500 Internal Server Error:** error interno durante el registro o el inicio de sesión.

### Ejemplo de inicio de sesión

**Solicitud:** `POST /api/sessions/login`

```json
{
  "email": "usuario@email.com",
  "password": "tu_contraseña"
}
```

Si las credenciales son correctas, la API responde con un mensaje de éxito y establece la cookie de autenticación.

## Estructura del proyecto

El proyecto está organizado en diferentes carpetas para separar las responsabilidades:

- **config:** configuración de la aplicación, conexión a la base de datos (`db.js`) y estrategias de autenticación de Passport.js (`passport.config.js`).
- **routes:** definición de los endpoints.
- **controllers:** manejo de las solicitudes y respuestas HTTP.
- **services:** lógica de negocio.
- **repositories:** acceso a los datos.
- **models:** esquemas de MongoDB.
- **middlewares:** funciones intermedias de Express para procesar solicitudes y aplicar validaciones cuando sea necesario.
- **utils:** funciones auxiliares, como la generación de JWT y el hash de contraseñas.
- **dao:** acceso a datos mediante objetos de acceso a datos (DAO).
- **app.js:** configuración de Express, middlewares generales y rutas.
- **server.js:** inicio del servidor y conexión con la base de datos.

Esta organización permite mantener el código más ordenado y facilita futuras modificaciones.

## Estrategias de Passport.js

La autenticación se implementa mediante Passport.js y el paquete `passport-custom`, utilizando tres estrategias:

- **register:** valida los datos recibidos, comprueba que el email no esté registrado y crea el usuario con la contraseña protegida mediante bcrypt.
- **login:** verifica las credenciales del usuario y permite generar un token JWT cuando son correctas. El token se almacena en una cookie `httpOnly`.
- **current:** obtiene el token de la cookie `currentUser`, verifica su validez y devuelve los datos básicos del usuario autenticado.

Las estrategias se ejecutan sin sesiones de Passport (`session: false`), ya que la autenticación se gestiona mediante JWT y cookies.

Si el token falta o no es válido, la estrategia `current` rechaza la autenticación.

### Extensibilidad

La autenticación está centralizada en `src/config/passport.config.js`, lo que permite incorporar futuras estrategias de autenticación con proveedores externos, como Google o GitHub, sin modificar `app.js`. Para ello, será necesario configurar las estrategias correspondientes y sus credenciales.

## Seguridad

La API incorpora diferentes medidas de seguridad:

- Las contraseñas se almacenan mediante hash con bcrypt.
- Los tokens JWT tienen un tiempo de expiración configurable.
- Las cookies `httpOnly` impiden el acceso directo a su contenido desde JavaScript del navegador.
- Las rutas protegidas verifican la autenticidad del token.
- Las variables sensibles se guardan en un archivo `.env`.

## Autor

**Facundo Veliz**