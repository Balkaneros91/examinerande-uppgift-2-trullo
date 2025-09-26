import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/error.js';
// import userRouter from './routes/userRoutes.js';
// import taskRouter from './routes/taskRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/health', (_req, res) => res.json({ ok: true }));


// app.use('/api/users', userRouter);
// app.use('/api/tasks', taskRouter);


app.use(notFound);
app.use(errorHandler);


export default app;