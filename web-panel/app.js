
function enviarSolicitud() {
  const telefono = document.getElementById("telefono").value.trim();
  
  if (!telefono) {
    alert("✍️ Escribe un número de teléfono primero");
    return;
  }

  alert(`✅ Solicitud enviada a: ${telefono}\n\n(En la versión completa se conecta al servidor)`);
}