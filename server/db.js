import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

/**
 * Singleton Prisma Client with connection pooling for Hostinger.
 * Lazy initialisation to prevent boot timeouts.
 */
if (!global._prisma) {
  let url = process.env.DATABASE_URL;
  if (!url.includes('connection_limit')) {
    url += (url.includes('?') ? '&' : '?') + 'connection_limit=2';
  }

  global._prisma = new PrismaClient({
    datasourceUrl: url,
    log: ['error'],
    errorFormat: 'minimal'
  });
  console.log('[DB] Singleton Prisma Client Ready (Lazy)');
}

export default global._prisma;
