import connectMongo from './db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); 
connectMongo();

import express, { json } from 'express';
const app = express()

app.use(json())
app.use(cors());
app.options('*', cors());


import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.listen(process.env.PORT || 10000, () => {
  console.log(`Server listening on port ${process.env.PORT || 10000}`);
});
