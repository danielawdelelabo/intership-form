import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import fs from 'fs';

const sslConfig = process.env.DATABASE_SSL_CERT && process.env.DATABASE_SSL_KEY && process.env.DATABASE_SSL_CA
  ? {
      cert: fs.readFileSync(process.env.DATABASE_SSL_CERT).toString(),
      key: fs.readFileSync(process.env.DATABASE_SSL_KEY).toString(),
      ca: fs.readFileSync(process.env.DATABASE_SSL_CA).toString(),
    }
  : undefined;

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: sslConfig,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export { pool };

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const client: PoolClient = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Helper function to execute transactions
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Test connection function
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

