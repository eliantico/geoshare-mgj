const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const servidor = http.createServer(app);
const io = new Server(servidor, { cors: { origin: "*" } });

const grupos = new Map();
const ubicaciones = new Map();

app.use(express.static(path.join(__dirname, '..')));

io.on('connection', (socket) => {
    console.log('🔌 Conectado:', socket.id);

    socket.on('unirse-grupo', (datos) => {
        const { codigo, esCreador, bloquearSalida } = datos;
        socket.join(codigo);
        if (!grupos.has(codigo)) {
            grupos.set(codigo, { admin: socket.id, bloquearSalida: bloquearSalida || false, miembros: [socket.id] });
        } else {
            grupos.get(codigo).miembros.push(socket.id);
        }
        socket.emit('confirmar-union', {
            esAdmin: grupos.get(codigo).admin === socket.id,
            bloquearSalida: grupos.get(codigo).bloquearSalida
        });
    });

    socket.on('actualizar-ubicacion', (datos) => {
        ubicaciones.set(socket.id, { lat: datos.lat, lng: datos.lng, nombre: datos.nombre });
        socket.to(datos.codigo).emit('ubicacion-recibida', { id: socket.id, lat: datos.lat, lng: datos.lng, nombre: datos.nombre });
    });

    socket.on('enviar-alerta', (datos) => {
        socket.to(datos.codigo).emit('alerta-recibida', { tipo: datos.tipo, de: datos.nombre });
    });

    socket.on('pedir-salir', (codigo) => {
        const g = grupos.get(codigo);
        const permitido = !g || g.admin === socket.id || !g.bloquearSalida;
        socket.emit('respuesta-salir', { permitido });
    });

    socket.on('disconnect', () => { ubicaciones.delete(socket.id); console.log('🔌 Desconectado:', socket.id); });
});

const PUERTO = process.env.PORT || 3000;
servidor.listen(PUERTO, () => console.log(`🚀 Servidor RutaLink en puerto ${PUERTO}`));
