import mysql from 'mysql2/promise';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('[DB] DATABASE_URL is required. Set it in Hostinger environment variables or .env.');
}

const url = new URL(process.env.DATABASE_URL);

/**
 * Direct MySQL Connection Pool for Hostinger Business Hosting.
 * Bypasses Prisma to avoid binary dependency issues.
 */
const host = (url.hostname === 'localhost' || url.hostname === '::1') ? '127.0.0.1' : (url.hostname || '127.0.0.1');

const pool = mysql.createPool({
  host,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.substring(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  multipleStatements: false
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
