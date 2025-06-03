import mongoose from 'mongoose';
import { env } from '../app/config/config'; // <--- AJUSTA ESTA RUTA si config.ts no está en un nivel superior

// Método para conectar a MongoDB
export const connectDB = async () => {
  try {
    // Intenta conectar usando la URI definida en tu config.ts
    const conn = await mongoose.connect(env.db.uri);
    console.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log("--------------------------");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    // En producción, es buena práctica salir del proceso si la DB no está disponible
    process.exit(1);
  }
};

// **Importante:**
// 1. Ya no necesitas 'sequelizeInstance', 'createInstanceDb' o 'getDbInstance' de Sequelize.
//    Mongoose gestiona la conexión internamente, y tus modelos se acceden directamente
//    después de que la conexión inicial se establece.
// 2. La llamada inicial a la conexión (el equivalente a tu 'getDbInstance();' al final)
//    DEBE MOVERSE a tu archivo principal del servidor (ej. app.ts o server.ts)
//    y ser llamada con 'await', ya que la conexión es asíncrona.

// Opcional: Manejar eventos de conexión de Mongoose para depuración o monitoreo
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected!');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});