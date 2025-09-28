import { z } from 'zod';
import { Types } from 'mongoose';

export const StatusEnum = z.enum(['to-do','in progress','blocked','done']);
const ObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: StatusEnum.optional(),
    assignedTo: ObjectId.transform(s => new Types.ObjectId(s)).nullable().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    status: StatusEnum.optional(),
    assignedTo: ObjectId.transform(s => new Types.ObjectId(s)).nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;