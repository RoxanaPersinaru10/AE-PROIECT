const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../database/models");
const { verifyToken } = require("../utils/tokenUtils");

const router = express.Router();

/**
 * 🟢 CREATE USER
 * POST /users
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificăm dacă există deja user cu același email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists", data: {} });
    }

    // Criptăm parola
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Creăm utilizatorul
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    delete user.dataValues.password;

    res
      .status(201)
      .json({ success: true, message: "User created", data: user });
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/**
 * 🟡 UPDATE USER
 * PUT /users/:id
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is not valid" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: {} });
    }

    // Dacă se actualizează parola, o criptăm
    let updatedData = { ...req.body };
    if (updatedData.password) {
      const salt = bcrypt.genSaltSync(10);
      updatedData.password = bcrypt.hashSync(updatedData.password, salt);
    }

    const updatedUser = await user.update(updatedData);
    delete updatedUser.dataValues.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error updating user:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/**
 * 🔴 DELETE USER
 * DELETE /users/:id
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is not valid" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.destroy();
    res
      .status(200)
      .json({ success: true, message: "User successfully deleted" });
  } catch (err) {
    console.error("❌ Error deleting user:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/**
 * 🧾 GET ALL USERS
 * GET /users
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["created_at", "DESC"]],
    });

    res
      .status(200)
      .json({ success: true, message: "Users retrieved", data: users });
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/**
 * 🔍 GET USER BY ID
 * GET /users/:id
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is not valid" });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: {} });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    console.error("❌ Error fetching user:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
