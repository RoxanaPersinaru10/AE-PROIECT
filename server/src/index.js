const express = require('express');
const cors = require('cors');
const { User } = require('./database/models'); // ✅ păstrează DOAR asta
const flightRoutes = require("./routes/flight.routes");
const dotenv = require('dotenv');
const morgan = require('morgan');

const app = express();
dotenv.config();






const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use("/flights", flightRoutes);

app.get("/", async (req, res) => {
  try {
    // creează un utilizator de test
    const newUser = await User.create({
      email: "test@example.com",
      name: "Test User",
      password: "parola123",
    });

    // citește toți utilizatorii din DB
    const users = await User.findAll();

    res.status(200).json({
      message: "Baza de date funcționează! ✅",
      totalUsers: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Eroare DB", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
