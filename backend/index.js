//Importaciones de librerias
const express = require('express');                         // Framework web
const http = require('http');                               // Servidor HTTP
const socketIo = require('socket.io');                      // Socket.IO para WebSockets
const redisAdapter = require('@socket.io/redis-adapter');   // Adaptador Redis para escalar Socket.IO
const mysql = require('mysql2/promise');                    // Cliente MySQL con soporte async/await
const { createClient } = require('redis');                  // Cliente Redis para manejar la caché

// Crear instancia de Socket.IO con CORS permitido
const app = express();

const path = require('path');
// Sirviendo archivos estáticos desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

const server = http.createServer(app);
const io = new socketIo.Server(server, {
    cors: {
        origin: "*"
    }
});

// Configuracion MySQL
const dbConfig = {
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'secret', //Valor por defecto para pruebas
    database: process.env.MYSQL_DATABASE || 'chat'
};

// Configuracion de Redis
const pubClient = createClient({ url: 'redis://redis:6379' });
const subClient = pubClient.duplicate();

(async () => {
    try {
        await pubClient.connect();
        await subClient.connect();
        io.adapter(redisAdapter(pubClient, subClient));

        const connection = await mysql.createConnection(dbConfig);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255),
        message TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        io.on('connection', (socket) => {
            console.log('Nuevo usuario conectado');

            socket.on('chat message', async (data) => {
                const { username, message } = data;

                // Guardar en la DB
                await connection.query(
                    'INSERT INTO messages (username, message) VALUES (?, ?)',
                    [username, message]
                );

                // Emitir a todos los clientes
                io.emit('chat message', { username, message });
            });

            socket.on('disconnect', () => {
                console.log('Usuario desconectado');
            });
        });

        server.listen(3000, () => {
            console.log('Servidor corriendo en http://localhost:3000');
        });
    } catch (err) {
        console.error('Error iniciando la app:', err);
    }
})();
