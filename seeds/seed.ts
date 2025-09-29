import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });


import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';
import Task from '../src/models/Task.js';


async function run() {
const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/trullo';
await mongoose.connect(uri);
console.log('Connected for seeding');


await User.deleteMany({});
await Task.deleteMany({});
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);


const [alice, bob] = await User.create([
{ name: 'Alice Admin', email: 'alice@example.com', password: await bcrypt.hash('Passw0rd!', SALT_ROUNDS) },
{ name: 'Bob Builder', email: 'bob@example.com', password: await bcrypt.hash('Passw0rd!', SALT_ROUNDS) },
]);


const tasks = [
{ title: 'Design project plan', status: 'to-do', assignedTo: alice._id },
{ title: 'Set up CI', status: 'in progress', assignedTo: bob._id },
{ title: 'Get stakeholder sign-off', status: 'blocked', assignedTo: null },
{ title: 'Create repo', status: 'done', assignedTo: alice._id, finishedAt: new Date() },
];
await Task.insertMany(tasks);


console.log('Seeded users and tasks');
await mongoose.disconnect();
}


run().catch((e) => {
console.error(e);
process.exit(1);
});