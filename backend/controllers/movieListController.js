const MovieList = require("../models/MovieList");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

// @desc    Criar uma nova lista de filmes
// @route   POST /api/lists
// @access  Private
const createMovieList = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "O nome da lista é obrigatório" });
  }

  try {
    const shareableLink = uuidv4(); // Gerar um link único para compartilhamento
    const movieList = new MovieList({
      name,
      description,
      owner: req.user._id,
      shareableLink,
    });

    const createdMovieList = await movieList.save();
    res.status(201).json(createdMovieList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter todas as listas de filmes do usuário logado
// @route   GET /api/lists
// @access  Private
const getUserMovieLists = async (req, res) => {
  try {
    const movieLists = await MovieList.find({ owner: req.user._id });
    res.json(movieLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter uma lista de filmes específica do usuário logado
// @route   GET /api/lists/:listId
// @access  Private
const getMovieListById = async (req, res) => {
  try {
    const movieList = await MovieList.findOne({
      _id: req.params.listId,
      owner: req.user._id,
    });

    if (movieList) {
      res.json(movieList);
    } else {
      res.status(404).json({ message: "Lista de filmes não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Atualizar uma lista de filmes
// @route   PUT /api/lists/:listId
// @access  Private
const updateMovieList = async (req, res) => {
  const { name, description } = req.body;

  try {
    const movieList = await MovieList.findOne({
      _id: req.params.listId,
      owner: req.user._id,
    });

    if (movieList) {
      movieList.name = name || movieList.name;
      movieList.description = description || movieList.description;

      const updatedMovieList = await movieList.save();
      res.json(updatedMovieList);
    } else {
      res.status(404).json({ message: "Lista de filmes não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deletar uma lista de filmes
// @route   DELETE /api/lists/:listId
// @access  Private
const deleteMovieList = async (req, res) => {
  try {
    const movieList = await MovieList.findOneAndDelete({
      _id: req.params.listId,
      owner: req.user._id,
    });

    if (movieList) {
      res.json({ message: "Lista de filmes removida" });
    } else {
      res.status(404).json({ message: "Lista de filmes não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Adicionar um filme a uma lista
// @route   POST /api/lists/:listId/movies
// @access  Private
const addMovieToList = async (req, res) => {
  const { title, imageUrl, watchLinks } = req.body;

  try {
    const movieList = await MovieList.findOne({
      _id: req.params.listId,
      owner: req.user._id,
    });

    if (movieList) {
      const newMovie = { title, imageUrl, watchLinks };
      movieList.movies.push(newMovie);
      await movieList.save();
      res.status(201).json(movieList);
    } else {
      res.status(404).json({ message: "Lista de filmes não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Atualizar um filme em uma lista
// @route   PUT /api/lists/:listId/movies/:movieId
// @access  Private
const updateMovieInList = async (req, res) => {
  const { title, imageUrl, watchLinks } = req.body;

  try {
    const movieList = await MovieList.findOne({
      _id: req.params.listId,
      owner: req.user._id,
    });

    if (movieList) {
      const movie = movieList.movies.id(req.params.movieId);

      if (movie) {
        movie.title = title || movie.title;
        movie.imageUrl = imageUrl || movie.imageUrl;
        movie.watchLinks = watchLinks || movie.watchLinks;
        await movieList.save();
        res.json(movieList);
      } else {
        res.status(404).json({ message: "Filme não encontrado na lista" });
      }
    } else {
      res.status(404).json({ message: "Lista de filmes não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remover um filme de uma lista
// @route   DELETE /api/lists/:listId/movies/:movieId
// @access  Private
const deleteMovieFromList = async (req, res) => {
  try {
    const movieList = await MovieList.findOne({
      _id: req.params.listId,
      owner: req.user._id,
    });

    if (movieList) {
      movieList.movies = movieList.movies.filter(
        (movie) => movie._id.toString() !== req.params.movieId
      );
      await movieList.save();
      res.json({ message: "Filme removido da lista" });
    } else {
      res.status(404).json({ message: "Lista de filmes não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter uma lista de filmes pública por shareableLink
// @route   GET /public/list/:shareableLink
// @access  Public
const getPublicMovieList = async (req, res) => {
  try {
    const movieList = await MovieList.findOne({ shareableLink: req.params.shareableLink });

    if (movieList) {
      res.json(movieList);
    } else {
      res.status(404).json({ message: "Lista de filmes pública não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMovieList,
  getUserMovieLists,
  getMovieListById,
  updateMovieList,
  deleteMovieList,
  addMovieToList,
  updateMovieInList,
  deleteMovieFromList,
  getPublicMovieList,
};
