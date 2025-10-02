const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  watchLinks: [
    {
      type: String,
    },
  ],
});

const MovieListSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shareableLink: {
      type: String,
      unique: true,
    },
    movies: [MovieSchema],
  },
  { timestamps: true }
);

const MovieList = mongoose.model("MovieList", MovieListSchema);

module.exports = MovieList;
