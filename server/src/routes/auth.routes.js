const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../database/models");
const { isValidToken } = require("../utils/tokenUtils");

const router = express.Router();

/**
 * 🟢 REGISTER - Creare cont nou
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Toate câmpurile sunt obligatorii.",
      });
    }

    // verifică dacă userul există deja
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Există deja un cont cu acest email.",
      });
    }

    // criptează parola
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "Cont creat cu succes!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Eroare la înregistrare:", err.message);
    res.status(500).json({
      success: false,
      message: "Eroare server.",
      error: err.message,
    });
  }
});

/**
 * 🟡 LOGIN - Autentificare
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Email incorect." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Parolă incorectă." });

    // generăm tokenul JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Autentificare reușită!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Eroare la login:", err.message);
    res.status(500).json({
      success: false,
      message: "Eroare server.",
      error: err.message,
    });
  }
});

/**
 * 🔵 CHECK - Verificare token JWT
 */
router.post("/check", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token not found", data: {} });
  }

  const validToken = isValidToken(token);

  if (!validToken) {
    return res
      .status(400)
      .json({ success: false, message: "Token not valid", data: {} });
  }

  res
    .status(200)
    .json({ success: true, message: "Token is valid", data: {} });
});
/**
 * 🧠 DEBUG - Afișează toți utilizatorii existenți în format HTML
 */
router.get("/all", async (req, res) => {
  try {
    const users = await User.findAll({ order: [["created_at", "DESC"]] });

    if (!users.length) {
      return res.send("<h2>Nu există utilizatori în baza de date.</h2>");
    }

    const rows = users
      .map(
        (u) => `
        <tr>
          <td>${u.id}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
          <td>${new Date(u.created_at).toLocaleString()}</td>
        </tr>`
      )
      .join("");

    res.send(`
      <html>
        <head>
          <title>Utilizatori salvați</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Utilizatori existenți în baza de date</h2>
          <table>
            <tr>
              <th>ID</th><th>Nume</th><th>Email</th><th>Rol</th><th>Creat la</th>
            </tr>
            ${rows}
          </table>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("<h3>Eroare la afișarea utilizatorilor.</h3>");
  }
});


module.exports = router;
