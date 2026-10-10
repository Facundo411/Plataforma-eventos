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
- **bcrypt:** encriptación mediante hash de contraseñas.
- **cookie-parser:** lectura y gestión de cookies.
- **dotenv:** administración de variables de entorno.

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

- **Registro de usuarios:** permite crear cuentas con validación de datos y contraseñas protegidas mediante bcrypt.
- **Inicio de sesión:** verifica el correo electrónico y la contraseña del usuario.
- **Autenticación con JWT:** genera tokens para identificar a los usuarios autenticados.
- **Gestión de cookies:** almacena el token en una cookie `httpOnly`.
- **Usuario actual:** permite consultar los datos básicos del usuario que inició sesión.
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

- **config:** configuración de la aplicación y conexión a la base de datos.
- **routes:** definición de los endpoints.
- **controllers:** manejo de las solicitudes y respuestas HTTP.
- **services:** lógica de negocio.
- **repositories:** acceso a los datos.
- **models:** esquemas de MongoDB.
- **middlewares:** autenticación y validaciones intermedias.
- **utils:** funciones auxiliares, como la generación de JWT y el hash de contraseñas.

Esta organización permite mantener el código más ordenado y facilita futuras modificaciones.

## Seguridad

La API incorpora diferentes medidas de seguridad:

- Las contraseñas se almacenan mediante hash con bcrypt.
- Los tokens JWT tienen un tiempo de expiración configurable.
- Las cookies `httpOnly` impiden el acceso directo a su contenido desde JavaScript del navegador.
- Las rutas protegidas verifican la autenticidad del token.
- Las variables sensibles se guardan en un archivo `.env`.

## Autor

**Facundo Veliz**