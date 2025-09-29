import { Router } from 'express';
import { create, list, get, update, remove } from '../controllers/userController.js';
import { validateBody } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';


const router = Router();


router.post('/', validateBody(createUserSchema), create);
router.get('/', list);
router.get('/:id', get);
router.put('/:id', validateBody(updateUserSchema), update);
router.delete('/:id', remove);


export default router;