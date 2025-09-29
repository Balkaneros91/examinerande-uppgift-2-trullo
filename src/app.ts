import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/error.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.get('/health', (_req, res) => res.json({ ok: true }));


app.get('/', (_req, res) => {
  res.json({
    name: 'Trullo API',
    health: '/health',
    users: '/api/users',
    tasks: '/api/tasks',
  });
});

app.use(notFound);
app.use(errorHandler);


export default app;