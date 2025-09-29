import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

import type { UserDTO } from '../types/api.js';
import { toUserDTO } from '../utils/mappers.js';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);


export async function createUser(input: { name: string; email: string; password: string }) {
    const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await User.create({ name: input.name, email: input.email, password: hashed });
    return toUserDTO(user);
}


export async function listUsers(): Promise<UserDTO[]> {
    const users = await User.find().lean();
    return users.map(toUserDTO);
}


export async function getUser(id: string): Promise<UserDTO> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw { status: 400, message: 'Invalid user id' };
    const user = await User.findById(id).lean();
    if (!user) throw { status: 404, message: 'User not found' };
    return toUserDTO(user);
}


export async function updateUser(
    id: string, 
    input: { name?: string; email?: string; password?: string }
): Promise<Partial<UserDTO>> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw { status: 400, message: 'Invalid user id' };
    
    const update: Record<string, unknown> = { ...input };
    if (input.password) {
        update.password = await bcrypt.hash(input.password, SALT_ROUNDS);
    }
    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!user) throw { status: 404, message: 'User not found' };
    return toUserDTO(user);
}


export async function deleteUser(id: string): Promise<{ ok: true }> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw { status: 400, message: 'Invalid user id' };
    const res = await User.findByIdAndDelete(id).lean();
    if (!res) throw { status: 404, message: 'User not found' };
    return { ok: true };
}
