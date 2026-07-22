const { Pool } = require('pg');
require('dotenv').config();

// Use IPv4-compatible Supabase connection pooler URL for Vercel Serverless environment
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.ektqllxwrrnxqdhtuywj:WuJ037hazfXJSvcj@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

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
