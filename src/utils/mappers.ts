import type { TaskDTO, UserDTO } from '../types/api.js';

export const toUserDTO = (u: any): UserDTO => ({
  id: String(u._id ?? u.id),
  name: u.name,
  email: u.email,
  createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
  updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : u.updatedAt,
});

export const toTaskDTO = (t: any): TaskDTO => ({
  id: String(t._id ?? t.id),
  title: t.title,
  description: t.description ?? '',
  status: t.status,
  assignedTo: t.assignedTo ? String(t.assignedTo._id ?? t.assignedTo) : null,
  createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
  finishedAt: t.finishedAt ? (t.finishedAt instanceof Date ? t.finishedAt.toISOString() : t.finishedAt) : null,
  assignee:
    t.assignedTo && t.assignedTo.name
      ? { id: String(t.assignedTo._id), name: t.assignedTo.name, email: t.assignedTo.email }
      : null,
});