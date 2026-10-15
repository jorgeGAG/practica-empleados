// src/config/database.ts
import mongoose from 'mongoose';
import dns from 'node:dns';

// Forzar el uso de los DNS de Google para resolver registros SRV
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDatabase = async (): Promise<void> => {
  const MONGO_URI = 'mongodb+srv://jorgeante08_db_user:uf3LPyg9mg9wVBJs@cluster0.hhfosdd.mongodb.net/?appName=Cluster0';
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔄 [Database]: Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error crítico al conectar a la base de datos:', error);
    process.exit(1);
  }
};

// import mongoose from 'mongoose';

// export const connectDatabase = async (): Promise<void> => {
//   const MONGO_URI = 'mongodb://127.0.0.1/usuarios_db';
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('🔄 [Database]: Conexión exitosa a MongoDB');
//   } catch (error) {
//     console.error('❌ Error crítico al conectar a la base de datos:', error);
//     process.exit(1);
//   }
// };
    