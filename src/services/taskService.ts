import { Types } from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';

import type { TaskDTO, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../types/api.js';
import { toTaskDTO } from '../utils/mappers.js';


export async function createTask(input: CreateTaskDTO): Promise<TaskDTO> {
    if (input.assignedTo) {
        const exists = await User.exists({ _id: input.assignedTo });
        if (!exists) throw { status: 400, message: 'assignedTo does not reference an existing user' };
    }
    const finishedAt = input.status === 'done' ? new Date() : null;

    const task = await Task.create({ 
        ...input, 
        finishedAt,
     });

    return toTaskDTO(task);
}


export async function updateTask(id: string, input: UpdateTaskDTO): Promise<TaskDTO> {
    if (!Types.ObjectId.isValid(id)) throw { status: 400, message: 'Invalid task id' };

    if (Object.prototype.hasOwnProperty.call(input, 'assignedTo')) {
        if (input.assignedTo) {
            const exists = await User.exists({ _id: input.assignedTo });
            if (!exists) throw { status: 400, message: 'assignedTo does not reference an existing user' };
        }
    }

    const current = await Task.findById(id);
    if (!current) throw { status: 404, message: 'Task not found' };

    if (typeof input.status !== 'undefined' && input.status !== current.status) {
        current.finishedAt = input.status === 'done' ? new Date() : null;
        current.status = input.status as TaskStatus;
    }

    if (typeof input.title !== 'undefined') current.title = input.title;
    if (typeof input.description !== 'undefined') current.description = input.description ?? '';

    const saved = await current.save();
    return toTaskDTO(saved.toObject());
}


export async function listTasks(query: { status?: TaskStatus; assignedTo?: string }) : Promise<TaskDTO[]> {
    const filter: any = {};
    if (query.status) filter.status = query.status;

    if (query.assignedTo) {
        if (query.assignedTo === 'null') {
            filter.assignedTo = null;
        } else {
            if (!Types.ObjectId.isValid(query.assignedTo)) {
                throw { status: 400, message: 'Invalid assignedTo user id' };
            }
            filter.assignedTo = new Types.ObjectId(query.assignedTo);
        }
    }

    const tasks = await Task.find(filter).populate('assignedTo', 'name email').lean();
    
    return tasks.map(toTaskDTO);
}


export async function getTask(id: string) : Promise<TaskDTO> {
    if (!Types.ObjectId.isValid(id)) throw { status: 400, message: 'Invalid task id' };

    const task = await Task.findById(id).populate('assignedTo', 'name email').lean();

    if (!task) throw { status: 404, message: 'Task not found' };
    return toTaskDTO(task);
}


export async function deleteTask(id: string) : Promise<{ ok: true }> {
    if (!Types.ObjectId.isValid(id)) throw { status: 400, message: 'Invalid task id' };

    const res = await Task.findByIdAndDelete(id).lean();
    if (!res) throw { status: 404, message: 'Task not found' };
    return { ok: true };
}
