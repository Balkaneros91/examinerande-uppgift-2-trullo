import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/error.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';


const app = express();
app.use(helmet({
  // Apollo Sandbox uses cross-origin resources; this can break it
  crossOriginEmbedderPolicy: false,
  // easiest for dev; tighten later
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));


app.get('/health', (_req, res) => res.json({ ok: true }));


app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

app.get('/', (_req, res) => {
  res.send('Trullo API is running. Try /health, /api/users, or /api/tasks');
});

app.use(notFound);
app.use(errorHandler);


export default app;