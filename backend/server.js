import express, { urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import userRoutes from './routes/user.route.js'
import { connectDB } from "./lib/db.js";
const app = express();
const PORT = process.env.PORT || 3000;

// Check required environment variables
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable is required");
  process.exit(1);
}

// CORS
app.use(cors({
  origin: 'https://www.polisense.info',
  credentials: true, 
}));

// Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log("Listening on port ", PORT);
  connectDB();
});
