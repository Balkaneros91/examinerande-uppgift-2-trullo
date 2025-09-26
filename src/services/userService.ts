import bcrypt from 'bcrypt';
import User from '../models/User.js';


const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);


export async function createUser(input: { name: string; email: string; password: string }) {
    const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await User.create({ name: input.name, email: input.email, password: hashed });
    return sanitize(user);
}


export async function listUsers() {
    const users = await User.find().lean();
    return users.map(sanitize);
}


export async function getUser(id: string) {
    const user = await User.findById(id).lean();
    if (!user) throw { status: 404, message: 'User not found' };
    return sanitize(user);
}


export async function updateUser(id: string, input: { name?: string; email?: string; password?: string }) {
    const update: any = { ...input };
    if (input.password) {
        update.password = await bcrypt.hash(input.password, SALT_ROUNDS);
    }
    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!user) throw { status: 404, message: 'User not found' };
    return sanitize(user);
}


export async function deleteUser(id: string) {
    const res = await User.findByIdAndDelete(id).lean();
    if (!res) throw { status: 404, message: 'User not found' };
    return { ok: true };
}


function sanitize(u: any) {
    const { password, ...rest } = u;
    return rest;
}