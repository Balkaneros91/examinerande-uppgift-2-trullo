import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { connectDB } from './config/db.js';
import app from './app.js';


const PORT = Number(process.env.PORT) || 4000;


async function start() {
    await connectDB(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/trullo');
    app.listen(PORT, () => {
    console.log(`Trullo API (NoSQL) listening on http://localhost:${PORT}`);
    });
}


start().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
});