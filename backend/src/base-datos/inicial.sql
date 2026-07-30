-- Crear base de datos si no existe
CREATE DATABASE geoshare;

-- Habilitar extensión para ubicaciones
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) UNIQUE NOT NULL,
  clave VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de solicitudes de ubicación
CREATE TABLE solicitudes (
  id SERIAL PRIMARY KEY,
  quien_pide INT REFERENCES usuarios(id),
  quien_recibe INT REFERENCES usuarios(id),
  estado VARCHAR(20) DEFAULT 'pendiente',
  expira_en TIMESTAMP,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de ubicaciones
CREATE TABLE ubicaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  latitud NUMERIC(10,6) NOT NULL,
  longitud NUMERIC(10,6) NOT NULL,
  momento TIMESTAMP DEFAULT NOW()
);