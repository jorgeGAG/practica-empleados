module.exports = {
  apps: [{
    name: "mi-node-app",
    script: "./dist/index.js",
    instances: "max", // Modo Cluster: usa todos los núcleos de la CPU
    exec_mode: "cluster",

    // Producción: Variables de entorno protegidas
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },

    // Logs y Monitoreo del Servidor
    error_file: "/var/www/tu-app/logs/err.log",
    out_file: "/var/www/tu-app/logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true
  }],

  // Automatización del Despliegue desde PC local
  deploy: {
    production: {
      user: 'ubuntu',
      host: '44.216.80.64',
      ref: 'origin/main',
      repo: 'git@github.com:jorgeGAG/practica-empleados.git',
      path: '/var/www/tu-app',
      'post-deploy': 'mkdir -p logs && cd backend && npm install && npm run build && pm2 reload ecosystem.config.js --env production && pm2 save'
    }
  }
};
