import 'dotenv/config';
import express, { Application } from 'express';
import morgan from 'morgan';

import userRouter from './routes/userRouter';
import recipeRouter from './routes/recipeRouter';

const app: Application = express();

//adding middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

//routing
app.use(userRouter);
app.use(recipeRouter);

export default app;
