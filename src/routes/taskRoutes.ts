import { Router } from 'express';
import { create, list, get, update, remove } from '../controllers/taskController.js';
import { validateBody } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';


const router = Router();


router.post('/', validateBody(createTaskSchema), create);
router.get('/', list);
router.get('/:id', get);
router.put('/:id', validateBody(updateTaskSchema), update);
router.delete('/:id', remove);


export default router;