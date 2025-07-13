import express, { urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import userRoutes from './routes/user.route.js'
import { connectDB } from "./lib/db.js";
const app = express();
const PORT = process.env.PORT;

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allow cookies with requests
}));

// Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
// app.use('/auth',authController);
app.use('/user',userRoutes);

app.listen(PORT, () => {
  console.log("Listening on port ", PORT);
  connectDB();
});
