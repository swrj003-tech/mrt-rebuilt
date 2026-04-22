import mysql from 'mysql2/promise';
import 'dotenv/config';

const url = new URL(process.env.DATABASE_URL);

/**
 * Direct MySQL Connection Pool for Hostinger Business Hosting.
 * Bypasses Prisma to avoid binary dependency issues.
 */
const pool = mysql.createPool({
  host: '127.0.0.1', // FORCED IPv4 FOR HOSTINGER STABILITY
  user: url.username,
  password: url.password,
  database: url.pathname.substring(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('[DB] ✅ Direct MySQL Connection Successful');
    conn.release();
  })
  .catch(err => {
    console.error('[DB] ❌ MySQL Connection Failed:', err.message);
  });

export default pool;
