import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import userRouter from './routes/userRouter';
import recipeRouter from './routes/recipeRouter';

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use(userRouter);
app.use(recipeRouter);

export default app;
