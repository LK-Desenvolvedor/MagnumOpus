const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Gerar Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "Usuário já existe" });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Dados de usuário inválidos" });
  }
};

// @desc    Autenticar usuário e obter token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Email ou senha inválidos" });
  }
};

// @desc    Solicitar recuperação de senha
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  // Gerar token de recuperação
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

  await user.save();

  // Criar URL de recuperação
  const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;

  const message = `Você está recebendo este email porque você (ou outra pessoa) solicitou a redefinição da senha da sua conta.
Por favor, clique neste link para redefinir sua senha:

${resetUrl}

Se você não solicitou isso, por favor, ignore este email e sua senha permanecerá inalterada.`;

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Ou outro serviço de email
      auth: {
        user: process.env.EMAIL_USER, // Variável de ambiente para o email
        pass: process.env.EMAIL_PASS, // Variável de ambiente para a senha do email
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Redefinição de Senha",
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email de recuperação enviado" });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500).json({ message: "Erro ao enviar email de recuperação" });
  }
};

// @desc    Redefinir senha
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token inválido ou expirado" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Senha redefinida com sucesso" });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
