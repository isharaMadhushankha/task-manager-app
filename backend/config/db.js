const { Pool } = require('pg');
require('dotenv').config();

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:WuJ037hazfXJSvcj@db.ektqllxwrrnxqdhtuywj.supabase.co:5432/postgres';

// Create a connection pool using the DATABASE_URL
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase / hosted PostgreSQL
  },
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

module.exports = pool;
