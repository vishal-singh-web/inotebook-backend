import connectMongo from './db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); 
connectMongo();

import express, { json } from 'express';
const app = express()

app.use(json())
app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:3000", // for local dev
    "https://i-notebook-teal.vercel.app" // for your live frontend
  ],
  credentials: true
}));


import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.listen(process.env.PORT || 10000, () => {
  console.log(`Server listening on port ${process.env.PORT || 10000}`);
});
