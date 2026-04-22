import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

/**
 * Singleton Prisma Client with connection pooling for Hostinger.
 * Lazy initialisation to prevent boot timeouts.
 */
if (!global._prisma) {
  let url = process.env.DATABASE_URL;
  if (url) {
    if (!url.includes('connection_limit')) url += (url.includes('?') ? '&' : '?') + 'connection_limit=3';
    if (!url.includes('connect_timeout')) url += '&connect_timeout=10';
    if (!url.includes('pool_timeout')) url += '&pool_timeout=10';
  }

  global._prisma = new PrismaClient({
    datasourceUrl: url,
    log: ['query', 'error', 'warn'],
    errorFormat: 'minimal'
  });

  // Explicit Connection Test
  global._prisma.$connect()
    .then(() => console.log('[DB] ✅ SQL Connection Established Successfully'))
    .catch((err) => {
      console.error('[DB] ❌ SQL Connection Failed:', err.message);
      console.error('[DB] URL Used (masked):', url.replace(/:.*@/, ':****@'));
    });
}

export default global._prisma;
