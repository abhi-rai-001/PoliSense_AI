import express, { urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import userRoutes from './routes/user.route.js';
const app = express();
const PORT = process.env.PORT || 3000;

// No startup checks needed for Supabase client initialization directly

// CORS
app.use(cors({
  origin: ['https://www.polisense.info', 'http://localhost:5173'],
  credentials: true, 
}));

// Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log("Listening on port ", PORT);
});
