const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const movieListRoutes = require("./routes/movieListRoutes");

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  'https://magnum-opus-three.vercel.app',
  'http://localhost:3000', 
  process.env.FRONTEND_URL 
].filter(Boolean); 

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requests sem 'Origin' (como de apps mobile ou ferramentas como curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Para parsear JSON no corpo da requisição

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lists", movieListRoutes);
app.use("/public", movieListRoutes); // Rotas públicas para listas

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
