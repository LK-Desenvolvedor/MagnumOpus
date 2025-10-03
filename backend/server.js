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

app.use(cors());
app.use(express.json()); // Para parsear JSON no corpo da requisição

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lists", movieListRoutes);
app.use("/public", movieListRoutes); // Rotas públicas para listas

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
