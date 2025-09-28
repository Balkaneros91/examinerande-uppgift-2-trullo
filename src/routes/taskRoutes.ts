import { Router } from 'express';
import * as ctrl from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';


const router = Router();


router.post('/', validate(createTaskSchema), ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.put('/:id', validate(updateTaskSchema), ctrl.update);
router.delete('/:id', ctrl.remove);


export default router;