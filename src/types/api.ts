export type { TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../schemas/task.schema.js';

export type Id = string;

export interface UserDTO {
    id: Id;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TaskDTO {
    id: Id;
    title: string;
    description?: string;
    status: 'to-do' | 'in progress' | 'blocked' | 'done';
    assignedTo: Id | null;
    createdAt: string;
    finishedAt: string | null;
    assignee?: Pick<UserDTO, 'id' | 'name' | 'email'> | null;
}