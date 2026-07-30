import 'package:flutter/material.dart';

void main() => runApp(const GeoShareApp());

class GeoShareApp extends StatelessWidget {
  const GeoShareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GeoShare 🛰️',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const PantallaPrincipal(),
    );
  }
}

class PantallaPrincipal extends StatelessWidget {
  const PantallaPrincipal({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('🛰️ GeoShare')),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.satellite_alt, size: 80, color: Colors.blue),
            SizedBox(height: 20),
            Text('Esperando solicitudes...', style: TextStyle(fontSize: 18)),
          ],
        ),
      ),
    );
  }
}