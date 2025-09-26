import { z } from 'zod';

export const StatusEnum = z.enum(['to-do','in progress','blocked','done']);

export const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: StatusEnum.optional(),
    assignedTo: z.string().nullable().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    status: StatusEnum.optional(),
    assignedTo: z.string().nullable().optional(),
});