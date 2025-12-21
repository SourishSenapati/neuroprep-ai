
import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkConnection() {
    console.log('Checking Database Connection...');
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        console.warn('⚠️  DATABASE_URL is not set in .env');
        console.warn('   The application will fallback to a Mock Database (In-Memory).');
        console.warn('   Data will NOT persist after restart.');
        return;
    }

    // Mask the password for logging
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`Connecting to: ${maskedUrl}`);

    const pool = new pg.Pool({
        connectionString: dbUrl,
        ssl: {
            rejectUnauthorized: false
        },
        connectionTimeoutMillis: 5000
    });

    try {
        const client = await pool.connect();
        console.log('✅  Connection Successful!');
        
        const res = await client.query('SELECT NOW()');
        console.log(`   Server Time: ${res.rows[0].now}`);
        
        client.release();
    } catch (err) {
        console.error('❌  Connection Failed:', err.message);
    } finally {
        await pool.end();
    }
}

checkConnection();
