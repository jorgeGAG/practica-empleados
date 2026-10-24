const DISCORD_WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  'https://discord.com/api/webhooks/1563441189892526132/P6fRzIvc5A6itfyDdGN8smm7dpMOL_EmHdvuYcSx1gPrtrb5paBKu54ly1GbKel6yNfh';

export class DiscordNotifier {
  private static async sendEmbed(embed: any): Promise<void> {
    if (process.env.NODE_ENV === 'test') return;
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'AWS EC2 - Empleados Bot',
          embeds: [embed]
        })
      });
    } catch (error) {
      console.warn('⚠️ No se pudo enviar notificación a Discord:', error);
    }
  }

  static async notifyCreated(empleado: any): Promise<void> {
    await this.sendEmbed({
      title: '🟢 [AUDITORÍA] Nuevo Empleado Creado',
      description: `Se ha registrado un nuevo colaborador en **MongoDB Atlas**.`,
      color: 0x10b981, // Verde
      fields: [
        { name: 'Nombre', value: empleado.nombre || 'N/A', inline: true },
        { name: 'Cargo', value: empleado.cargo || 'N/A', inline: true },
        { name: 'Departamento', value: empleado.departamento || 'N/A', inline: true },
        { name: 'Sueldo', value: `$${empleado.sueldo || 0}`, inline: true }
      ],
      timestamp: new Date().toISOString()
    });
  }

  static async notifyUpdated(id: string, empleado: any): Promise<void> {
    await this.sendEmbed({
      title: '🟡 [AUDITORÍA] Empleado Actualizado',
      description: `Se modificaron los datos del colaborador (ID: \`${id}\`).`,
      color: 0xf59e0b, // Ámbar
      fields: [
        { name: 'Nombre', value: empleado.nombre || 'N/A', inline: true },
        { name: 'Cargo', value: empleado.cargo || 'N/A', inline: true },
        { name: 'Departamento', value: empleado.departamento || 'N/A', inline: true },
        { name: 'Sueldo', value: `$${empleado.sueldo || 0}`, inline: true }
      ],
      timestamp: new Date().toISOString()
    });
  }

  static async notifyDeleted(id: string): Promise<void> {
    await this.sendEmbed({
      title: '🔴 [AUDITORÍA] Empleado Eliminado',
      description: `Se eliminó el colaborador con ID: \`${id}\` de MongoDB Atlas.`,
      color: 0xef4444, // Rojo
      timestamp: new Date().toISOString()
    });
  }

  static async notifyQueried(count: number): Promise<void> {
    await this.sendEmbed({
      title: '🔵 [AUDITORÍA] Consulta de Directorio',
      description: `Se consultó la lista de empleados. Total encontrados: **${count}**.`,
      color: 0x3b82f6, // Azul
      timestamp: new Date().toISOString()
    });
  }
}
