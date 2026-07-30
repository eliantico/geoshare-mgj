const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mercadopago = require('mercadopago');
const path = require('path');

const app = express();
const servidor = http.createServer(app);
const io = socketIo(servidor);

// --------------------------
// 🔑 CONFIGURACIÓN DE MERCADO PAGO
// --------------------------
mercadopago.configure({
  access_token: TEST-2527381505108973-091620-197037de95319cbe9141ba4430e4cd01-352269539
});

// Servir archivos de la web
app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());

// --------------------------
// 💳 CREAR LINK DE PAGO
// --------------------------
app.post('/crear-pago', async (req, res) => {
  try {
    const { plan, correo } = req.body;

    const precio = plan === 'personal' ? 1200 : 3500;
    const nombrePlan = plan === 'personal' ? 'Plan Personal / Familia' : 'Plan Empresa / Delivery';

    const solicitudPago = await mercadopago.preferences.create({
      items: [{
        title: nombrePlan,
        unit_price: precio,
        currency_id: 'ARS',
        quantity: 1
      }],
      back_urls: {
        success: '/pago-exitoso',
        failure: '/pago-fallido',
        pending: '/pago-pendiente'
      },
      notification_url: 'https://tu-direccion.com/aviso-pago',
      external_reference: `${correo}|${plan}`
    });

    res.json({ linkPago: solicitudPago.body.init_point });
  } catch (error) {
    console.error('Error al generar pago:', error);
    res.status(500).json({ error: 'No se pudo generar el pago' });
  }
});

// --------------------------
// ✅ RECIBIR AVISO DE PAGO CONFIRMADO
// --------------------------
app.post('/aviso-pago', async (req, res) => {
  try {
    if (req.query.topic === 'payment') {
      const pago = await mercadopago.payment.findById(req.query.id);
      const estado = pago.body.status;
      const referencia = pago.body.external_reference;

      if (estado === 'approved') {
        const [correo, plan] = referencia.split('|');
        console.log('✅ PAGO APROBADO');
        console.log('Usuario:', correo);
        console.log('Plan:', plan);
        // Acá luego agregaremos la parte de guardar en base de datos
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al recibir aviso:', error);
    res.sendStatus(500);
  }
});

// --------------------------
// 🗺️ COMUNICACIÓN EN TIEMPO REAL (SOCKET)
// --------------------------
io.on('connection', (socket) => {
  console.log('🔌 Usuario conectado');

  socket.on('crear-grupo', (datos) => {
    socket.join(datos.grupo);
    socket.emit('grupo-creado', datos.grupo);
  });

  socket.on('entrar-grupo', (datos) => {
    socket.join(datos.grupo);
    socket.emit('entrada-ok', datos.grupo);
  });

  socket.on('ubicacion', (datos) => {
    socket.to(datos.grupo).emit('nueva-ubicacion', datos);
  });

  socket.on('sos', (datos) => {
    socket.to(datos.grupo).emit('alerta-sos', datos);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Usuario desconectado');
  });
});

// --------------------------
// ▶️ INICIAR SERVIDOR
// --------------------------
const PUERTO = process.env.PORT || 3000;
servidor.listen(PUERTO, () => {
  console.log(`✅ Servidor funcionando en el puerto ${PUERTO}`);
});
