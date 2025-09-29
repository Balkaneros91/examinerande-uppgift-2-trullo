import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import app from './app.js';

const PORT = Number(process.env.PORT) || 4000;

async function start() {
    const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/trullo';
    if (!process.env.MONGODB_URI) {
    console.warn('[WARN] MONGODB_URI not set, falling back to local mongodb://127.0.0.1:27017/trullo');
  }


    await connectDB(uri);
    app.listen(PORT, () => {
    console.log(`Trullo API (NoSQL) listening on http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
});