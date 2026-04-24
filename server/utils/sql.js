export function quoteId(identifier) {
  if (!/^[A-Za-z0-9_]+$/.test(identifier || '')) {
    throw new Error(`Unsafe SQL identifier: ${identifier}`);
  }
  return `\`${identifier}\``;
}

export async function listTables(pool) {
  const [tables] = await pool.query('SHOW TABLES');
  return tables.map((row) => Object.values(row)[0]);
}

export async function resolveTable(pool, target) {
  const tables = await listTables(pool);
  const found = tables.find((table) => table.toLowerCase() === target.toLowerCase());
  return found || target;
}

export async function resolveTables(pool, targets) {
  const tables = await listTables(pool);
  const lower = new Map(tables.map((table) => [table.toLowerCase(), table]));
  return Object.fromEntries(
    targets.map((target) => [target, lower.get(target.toLowerCase()) || target])
  );
}

export async function getColumns(pool, table) {
  const [columns] = await pool.query(`SHOW COLUMNS FROM ${quoteId(table)}`);
  return new Set(columns.map((column) => column.Field));
}

export function parseJson(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (value == null || value === '') return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function clampInt(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

export function cleanString(value, maxLength = 1000) {
  return String(value ?? '').trim().slice(0, maxLength);
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}
