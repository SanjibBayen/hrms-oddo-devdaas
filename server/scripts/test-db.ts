require('dotenv').config();
const mongoose = require('mongoose');
const Redis = require('ioredis');

async function test() {
  console.log('\n========================================');
  console.log('  TESTING DATABASE CONNECTIONS');
  console.log('========================================\n');

  // ============================================================
  // TEST MONGODB
  // ============================================================
  console.log('📦 Testing MongoDB Atlas...');
  try {
    const conn = await mongoose.connect(process.env.MONGODB_WRITE_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    const ping = await conn.connection.db.admin().ping();
    console.log('✅ MongoDB:', JSON.stringify(ping));
    await mongoose.disconnect();
  } catch (e) {
    console.log('❌ MongoDB FAILED:', e.message);
    console.log('   👉 Go to MongoDB Atlas → Network Access → Add your IP');
  }

  console.log('');

  // ============================================================
  // TEST REDIS (without TLS)
  // ============================================================
  console.log('📦 Testing Redis Cloud...');
  try {
    const redis = new Redis({
      host: 'kettle-pipe-mitten-98763.db.redis.io',
      port: 12033,
      password: 'bHptusKRy6ZflQ8PMRPo6AarJ0aTzkxo',
      connectTimeout: 10000,
      retryStrategy(times) {
        if (times > 3) return null;
        return 1000;
      },
    });

    redis.on('error', () => {}); // Suppress errors during test

    const ping = await redis.ping();
    console.log('✅ Redis:', ping);

    await redis.set('test', 'ok', 'EX', 60);
    const val = await redis.get('test');
    console.log('   Get/Set test:', val);

    await redis.quit();
  } catch (e) {
    console.log('❌ Redis FAILED:', e.message);
    console.log('   👉 Check if Redis Cloud allows your IP');
  }

  console.log('\n========================================');
  console.log('  TEST COMPLETE');
  console.log('========================================\n');
  process.exit(0);
}

test();