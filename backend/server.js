const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const servidor = http.createServer(app);
const io = new Server(servidor, { cors: { origin: "*" } });

// Guardado temporal (más adelante pasamos a base de datos)
const grupos = new Map(); // clave: codigoGrupo → datos: { admin: id, bloquearSalida: boolean, miembros: [] }
const ubicaciones = new Map(); // clave: idUsuario → coordenadas

// Servir la página web
app.use(express.static(path.join(__dirname, '..')));

// Cuando alguien se conecta
io.on('connection', (socket) => {
    console.log('🔌 Conectado:', socket.id);

    // Unirse a un grupo
    socket.on('unirse-grupo', (datos) => {
        const { codigo, esCreador, bloquearSalida } = datos;
        socket.join(codigo);
        
        if (!grupos.has(codigo)) {
            grupos.set(codigo, {
                admin: socket.id,
                bloquearSalida: bloquearSalida || false,
                miembros: [socket.id]
            });
        } else {
            grupos.get(codigo).miembros.push(socket.id);
        }

        socket.emit('confirmar-union', {
            esAdmin: grupos.get(codigo).admin === socket.id,
            bloquearSalida: grupos.get(codigo).bloquearSalida
        });

        console.log(`✅ ${socket.id} en grupo ${codigo}`);
    });

    // Recibir y reenviar ubicación
    socket.on('actualizar-ubicacion', (datos) => {
        const { codigo, lat, lng, nombre } = datos;
        ubicaciones.set(socket.id, { lat, lng, nombre });
        socket.to(codigo).emit('ubicacion-recibida', {
            id: socket.id, lat, lng, nombre
        });
    });

    // Recibir y reenviar alertas
    socket.on('enviar-alerta', (datos) => {
        socket.to(datos.codigo).emit('alerta-recibida', {
            tipo: datos.tipo,
            de: datos.nombre || 'Miembro'
        });
    });

    // Pedir permiso para salir
    socket.on('pedir-salir', (codigo) => {
        const grupo = grupos.get(codigo);
        if (!grupo) return socket.emit('respuesta-salir', { permitido: true });
        const permitido = (grupo.admin === socket.id) || !grupo.bloquearSalida;
        socket.emit('respuesta-salir', { permitido });
    });

    // Cuando se desconecta
    socket.on('desconectar', () => {
        ubicaciones.delete(socket.id);
        console.log('🔌 Desconectado:', socket.id);
    });
});

// Puerto que usa Render
const PUERTO = process.env.PORT || 3000;
servidor.listen(PUERTO, () => {
    console.log(`🚀 Servidor RutaLink funcionando en puerto ${PUERTO}`);
});
