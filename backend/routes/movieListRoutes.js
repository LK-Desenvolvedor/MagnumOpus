const express = require("express");
const {
  createMovieList,
  getUserMovieLists,
  getMovieListById,
  updateMovieList,
  deleteMovieList,
  addMovieToList,
  updateMovieInList,
  deleteMovieFromList,
  getPublicMovieList,
} = require("../controllers/movieListController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Rotas para listas de filmes (privadas)
router.route("/").post(protect, createMovieList).get(protect, getUserMovieLists);
router
  .route("/:listId")
  .get(protect, getMovieListById)
  .put(protect, updateMovieList)
  .delete(protect, deleteMovieList);

// Rotas para filmes dentro de uma lista (privadas)
router.route("/:listId/movies").post(protect, addMovieToList);
router
  .route("/:listId/movies/:movieId")
  .put(protect, updateMovieInList)
  .delete(protect, deleteMovieFromList);

// Rota para acesso público a uma lista
router.get("/public/list/:shareableLink", getPublicMovieList);

module.exports = router;
