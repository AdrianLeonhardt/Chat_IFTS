# Chat en Tiempo Real con Docker, Node.js, Redis y MySQL

## 📌 Descripción

Este proyecto es una aplicación de chat en tiempo real construida con:

- Node.js + Express + Socket.IO (backend)
- MySQL (para almacenar los mensajes)
- Redis (como adaptador Pub/Sub de Socket.IO)
- Docker Compose para orquestar todo

## 📐 Arquitectura

- `backend`: servidor de Socket.IO que maneja mensajes y los guarda en MySQL
- `mysql`: base de datos para persistencia
- `redis`: adaptador de comunicación para escalabilidad (Pub/Sub)
- `frontend`: archivo HTML simple para probar el chat

## 🚀 Cómo ejecutar

### Requisitos

- Docker
- Docker Compose

### Instrucciones

1. Clona el repositorio o copia los archivos.
2. Navega al proyecto:
   ```bash
   cd chat-app
3. Construí y levantá los servicios con Docker Compose:
   ```bash
   docker-compose up --build
http://localhost:3000
4. Utiliza el navegador para comenzar con el chat.
# Chat_IFTS
