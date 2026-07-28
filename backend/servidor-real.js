const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const servidor = http.createServer(app);
const io = new Server(servidor);

app.use(express.static(path.join(__dirname, '../web-panel')));

const grupos = {};

io.on('connection', (socket) => {
  console.log('✅ Conectado');

  socket.on('crear-grupo', (datos) => {
    grupos[datos.grupo] = { participantes: [datos.nombre] };
    socket.join(datos.grupo);
    socket.emit('grupo-creado', datos.grupo);
  });

  socket.on('entrar-grupo', (datos) => {
    if (!grupos[datos.grupo]) return socket.emit('error', 'Grupo no existe');
    if (!grupos[datos.grupo].participantes.includes(datos.nombre)) {
      grupos[datos.grupo].participantes.push(datos.nombre);
    }
    socket.join(datos.grupo);
    socket.emit('entrada-ok', datos.grupo);
  });

  socket.on('ubicacion', (datos) =>const PUERTO = process.env.PORT || 3000;

// Ruta para que Render sepa que funciona
app.get('/', (req, res) => {
  res.send('✅ GeoShare funcionando');
});

servidor.listen(PUERTO, '0.0.0.0', () => {
  console.log('🚀 Sistema listo en puerto', PUERTO);
}); 
});
    io.to(datos.grupo).emit('nueva-ubicacion', datos);
  });

  // ✅ REENVÍA LA ALERTA CON UBICACIÓN A TODOS
  socket.on('sos', (datos) => {
    io.to(datos.grupo).emit('alerta-sos', datos);
    app.get('/', (req, res) => {
  res.send('✅ GeoShare funcionando');
});
  });

  socket.on('disconnect', () => console.log('❌ Desconectado'));
});
servidor.listen(PUERTO, '0.0.0.0', () => {
archivo movido correctamente
