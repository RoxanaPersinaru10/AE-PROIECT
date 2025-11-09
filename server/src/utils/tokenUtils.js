// server/src/utils/token.js
const jwt = require("jsonwebtoken");

// ✅ Middleware pentru protejarea rutelor
const verifyToken = (req, res, next) => {
  const bearerToken = req.headers["authorization"];

  if (!bearerToken)
    return res.status(401).json({
      success: false,
      message: "Token lipsă din header Authorization",
    });

  const token = bearerToken.split(" ")[1];
  if (!token)
    return res.status(400).json({ success: false, message: "Token invalid" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(400)
        .json({ success: false, message: "Token invalid", data: {} });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// ✅ Funcție simplă de verificare token (folosită la /auth/check)
const isValidToken = (token) => {
  try {
    jwt.verify(token, process.env.TOKEN_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { verifyToken, isValidToken };
