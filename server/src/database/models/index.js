const User = require("./user");
const Flight = require("./flight");
const Booking = require("./booking");

// Relații (asocieri)
User.hasMany(Booking, { foreignKey: "userId", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "userId" });

Flight.hasMany(Booking, { foreignKey: "flightId", onDelete: "CASCADE" });
Booking.belongsTo(Flight, { foreignKey: "flightId" });

module.exports = { User, Flight, Booking };

