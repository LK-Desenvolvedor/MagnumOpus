const User = require("../models/User");

// @desc    Obter perfil do usuário
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: "Usuário não encontrado" });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ message: "Usuário não encontrado" });
  }
};

// @desc    Deletar conta do usuário
// @route   DELETE /api/users/me
// @access  Private
const deleteUser = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await user.deleteOne();
    res.json({ message: "Usuário removido" });
  } else {
    res.status(404).json({ message: "Usuário não encontrado" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
