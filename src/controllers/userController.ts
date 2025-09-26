import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/userService.js';

type IdParam = { id: string };

export async function create(req: Request, res: Response, next: NextFunction) {
    try { 
        const user = await service.createUser(req.body);
        res.status(201).json(user); 
    } catch (err) { 
        next(err); 
    }
}
export async function list(_req: Request, res: Response, next: NextFunction) {
    try { 
        const users = await service.listUsers(); 
        res.json(users); 
    } catch (err) { next(err); }
}
export async function get(req: Request<IdParam>, res: Response, next: NextFunction) {
    try { 
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: { code: 400, message: "Missing :id" } });
        const user = await service.getUser(id); 
        res.json(user); 
    } catch (err) { next(err); }
}
export async function update(req: Request<IdParam>, res: Response, next: NextFunction) {
    try { 
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: { code: 400, message: "Missing :id" } });
        const user = await service.updateUser(id, req.body); 
        res.json(user); 
    } catch (err) { next(err); }
}
export async function remove(req: Request<IdParam>, res: Response, next: NextFunction) {
    try { 
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: { code: 400, message: "Missing :id" } });
        const r = await service.deleteUser(id); 
        res.json(r); 
    } catch (err) { next(err); }
}