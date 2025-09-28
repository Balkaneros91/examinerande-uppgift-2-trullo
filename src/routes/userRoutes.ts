import { Router } from 'express';
import * as ctrl from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';


const router = Router();


router.post('/', validate(createUserSchema), ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.put('/:id', validate(updateUserSchema), ctrl.update);
router.delete('/:id', ctrl.remove);


export default router;