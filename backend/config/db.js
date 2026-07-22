const { Pool } = require('pg');
require('dotenv').config();

let connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.ektqllxwrrnxqdhtuywj:WuJ037hazfXJSvcj@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

// Auto-transform IPv6-only Supabase direct host to IPv4-compatible Pooler URL for Vercel
if (connectionString.includes('db.ektqllxwrrnxqdhtuywj.supabase.co')) {
  connectionString = connectionString
    .replace('db.ektqllxwrrnxqdhtuywj.supabase.co:5432', 'aws-0-ap-southeast-2.pooler.supabase.com:6543')
    .replace('db.ektqllxwrrnxqdhtuywj.supabase.co', 'aws-0-ap-southeast-2.pooler.supabase.com:6543')
    .replace('//postgres:', '//postgres.ektqllxwrrnxqdhtuywj:');
}

// Create a connection pool using the resolved IPv4 connection string
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
