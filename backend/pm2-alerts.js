const pm2 = require('pm2');

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1563441189892526132/P6fRzIvc5A6itfyDdGN8smm7dpMOL_EmHdvuYcSx1gPrtrb5paBKu54ly1GbKel6yNfh';

function sendDiscordAlert(title, message, color) {
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: title,
        description: message,
        color: color,
        timestamp: new Date().toISOString()
      }]
    })
  }).catch((err) => console.error('Error enviando alerta a Discord:', err));
}

pm2.connect((err) => {
  if (err) {
    console.error('Error conectando con PM2:', err);
    process.exit(2);
  }

  console.log('🔔 Monitor de Alertas PM2 para Discord iniciado exitosamente.');
  sendDiscordAlert(
    '🚀 Monitor AWS EC2 Conectado',
    'El sistema de alertas automáticas para Discord está activo en la instancia AWS EC2.',
    3066993 // Verde
  );

  pm2.launchBus((err, bus) => {
    if (err) {
      console.error('Error en bus de PM2:', err);
      return;
    }

    bus.on('process:event', (data) => {
      if (!data || !data.process || data.process.name === 'pm2-alerts') return;

      if (data.event === 'stop') {
        sendDiscordAlert(
          '🛑 [ALERTA] Proceso Detenido (Simulación de Caída)',
          `La aplicación **${data.process.name}** (Instancia ID: ${data.process.pm_id}) ha sido detenida en AWS.`,
          15158332 // Rojo
        );
      } else if (data.event === 'start' || data.event === 'restart') {
        sendDiscordAlert(
          '✅ [RECUPERADO] Proceso en Línea',
          `La aplicación **${data.process.name}** (Instancia ID: ${data.process.pm_id}) está activa y funcionando en AWS.`,
          3066993 // Verde
        );
      }
    });
  });
});
