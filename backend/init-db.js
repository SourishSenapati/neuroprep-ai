import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Client } = pg;

async function init() {
  const defaultClient = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
  });

  try {
    await defaultClient.connect();
    console.log('Connected to default postgres database');

    const res = await defaultClient.query("SELECT 1 FROM pg_database WHERE datname = 'neuroprep'");
    if (res.rows.length === 0) {
      console.log('Creating database neuroprep...');
      await defaultClient.query('CREATE DATABASE neuroprep');
      console.log('Database created.');
    } else {
      console.log('Database neuroprep already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  } finally {
    await defaultClient.end();
  }

  // Connect to neuroprep
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/neuroprep'
  });

  try {
    await client.connect();
    console.log('Connected to neuroprep database');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema...');
    await client.query(schema);
    console.log('Schema applied successfully.');

  } catch (err) {
    console.error('Error applying schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

init();
