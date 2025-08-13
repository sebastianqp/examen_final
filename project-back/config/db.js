import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // Configura search_path para que use el esquema investigacion y public
  options: '--search_path=investigacion,public'
});

// Función para probar la conexión a la base de datos
export const connect = async () => {
  const client = await pool.connect();
  client.release();
};

export default pool;
