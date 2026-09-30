# Plataforma de Eventos e Inscripciones

API REST desarrollada con Node.js y Express como base arquitectónica para una plataforma de venta de entradas para eventos musicales.

## Temática

La plataforma estará orientada a la publicación de eventos musicales y la venta de entradas para recitales, festivales y otros eventos.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- JavaScript
- ESM

## Instalación

git clone URL_DE_TU_REPOSITORIO
cd Plataforma-eventos
npm install

Crear `.env` a partir de `.env.example`:

PORT=8080
NODE_ENV=development
MONGO_URL=tu_mongo_url
JWT_SECRET=tu_jwt_secret

## Ejecución

npm start

## Endpoints

- GET `/api/health` — Estado del servidor.
- GET `/api/events` — Lista de eventos.
- GET `/api/sessions` — Estructura inicial de sesiones.

## Estructura

src/
├── app.js
├── server.js
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── dao/
├── models/
├── middlewares/
└── utils/

## Arquitectura

Routes → Controllers → Services → Repositories → Models → MongoDB

## Autor

Facundo Veliz