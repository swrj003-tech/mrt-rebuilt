import mysql from 'mysql2/promise';
import 'dotenv/config';

/**
 * Direct MySQL Connection Pool for Hostinger Business Hosting.
 * Bypasses Prisma to avoid binary dependency issues.
 */
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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
