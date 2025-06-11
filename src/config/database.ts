import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DATABASE_HOST || "europe-west1-001.proxy.kinsta.app",
  port: parseInt(process.env.DATABASE_PORT || "30657"),
  database: process.env.DATABASE_NAME || "internship-form",
  user: process.env.DATABASE_USER || "raven",
  password: process.env.DATABASE_PASSWORD || "hM0-uW1_rF9-bM4_rZ9-",
  ssl: {
    rejectUnauthorized: false, // Required for Kinsta
  },
});

export default pool;
