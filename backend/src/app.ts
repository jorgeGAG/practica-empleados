import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import empleadosRoutes from './routes/empleados.routes';
import authRoutes from './routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', empleadosRoutes);
app.use('/api/v1/auth', authRoutes);

app.use(errorMiddleware);

export default app;