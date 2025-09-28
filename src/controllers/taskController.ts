import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/taskService.js';
import { StatusEnum } from '../schemas/task.schema.js';
import { type TaskStatus } from '../models/Task.js';

type IdParam = { id: string };

function toTaskStatus(q: unknown) {
    const r = StatusEnum.safeParse(q);
    return r.success ? r.data : undefined;
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try { 
        const task = await service.createTask(req.body); 
        res.status(201).json(task); 
    } catch (err) { next(err); }
}

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const status = toTaskStatus(req.query.status);
        const assignedTo = typeof req.query.assignedTo === 'string' ? req.query.assignedTo : undefined;
        
        const query : { status?: TaskStatus; assignedTo? : string } = {
            ...(status !== undefined ? { status } : {}),
            ...(assignedTo !== undefined ? { assignedTo } : {}),
        };

        const tasks = await service.listTasks(query);
        res.json(tasks);
    } catch (err) { next(err); }
}

export async function get(req: Request<IdParam>, res: Response, next: NextFunction) {
    try { 
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: { code: 400, message: "Missing :id" } });
        const task = await service.getTask(id); 
        res.json(task); 
    } catch (err) { next(err); }
}

export async function update(req: Request<IdParam>, res: Response, next: NextFunction) {
    try { 
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: { code: 400, message: "Missing :id" } });
        const task = await service.updateTask(id, req.body); 
        res.json(task); 
    } catch (err) { next(err); }
}

export async function remove(req: Request<IdParam>, res: Response, next: NextFunction) {
    try { 
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: { code: 400, message: "Missing :id" } });
        const r = await service.deleteTask(id); 
        res.json(r); 
    } catch (err) { next(err); }
}