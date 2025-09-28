import { Types } from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';
import type { TaskStatus } from '../models/Task.js';


export async function createTask(input: {
    title: string; 
    description?: string; 
    status?: TaskStatus; 
    assignedTo?: string | null 
}) {
    if (input.assignedTo) {
        const _id = new Types.ObjectId(input.assignedTo);
        const exists = await User.exists({ _id });
        if (!exists) throw { status: 400, message: 'assignedTo does not reference an existing user' };
    }
    const finishedAt = input.status === 'done' ? new Date() : null;
    const assignedTo = input.assignedTo ? new Types.ObjectId(input.assignedTo) : null;

    const task = await Task.create({ ...input, assignedTo, finishedAt });
    return toJson(task);
}


export async function updateTask(id: string, input: { 
    title?: string; 
    description?: string | null; 
    status?: TaskStatus; 
    assignedTo?: string | null;
}) {
    const current = await Task.findById(id);
    if (!current) throw { status: 404, message: 'Task not found' };


    if (typeof input.status !== 'undefined' && input.status !== current.status) {
        current.finishedAt = input.status === 'done' ? new Date() : null;
        current.status = input.status;
    }


    if (typeof input.title !== 'undefined') current.title = input.title;
    if (typeof input.description !== 'undefined') current.description = input.description ?? '';

    if (Object.prototype.hasOwnProperty.call(input, 'assignedTo')) {
        current.assignedTo = input.assignedTo ? new Types.ObjectId(input.assignedTo) : null;
    }

    const saved = await current.save();
    return toJson(saved.toObject());
}


export async function listTasks(query: { 
    status?: TaskStatus; 
    assignedTo?: string 
}) {
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;

    if (query.assignedTo) {
        filter.assignedTo = query.assignedTo === 'null' 
        ? null 
        : new Types.ObjectId(query.assignedTo);
    }
    const tasks = await Task.find(filter).populate('assignedTo', 'name email').lean();
    return tasks.map(toJson);

}


export async function getTask(id: string) {
    const task = await Task.findById(id).populate('assignedTo', 'name email').lean();
    if (!task) throw { status: 404, message: 'Task not found' };
    return toJson(task);
}


export async function deleteTask(id: string) {
    const res = await Task.findByIdAndDelete(id).lean();
    if (!res) throw { status: 404, message: 'Task not found' };
    return { ok: true };
}


function toJson(t: any) {
    const { _id, __v, ...rest } = t;
    return { id: String(_id), ...rest };
}