import React, { useState } from "react";
import Autosuggest from "react-autosuggest";

function SearchBar() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [flights, setFlights] = useState([]);

  // 📍 Lista de aeroporturi pentru autocomplete
  const airports = [
    { code: "OTP", name: "Bucharest Henri Coandă International" },
    { code: "BLQ", name: "Bologna Guglielmo Marconi" },
    { code: "LHR", name: "London Heathrow" },
    { code: "CDG", name: "Paris Charles de Gaulle" },
    { code: "JFK", name: "New York John F. Kennedy" },
    { code: "MAD", name: "Madrid Barajas" },
    { code: "FCO", name: "Rome Fiumicino" },
    { code: "AMS", name: "Amsterdam Schiphol" },
    { code: "IST", name: "Istanbul Airport" },
  ];

  // 🔍 Funcții pentru Autosuggest
  const getSuggestions = (value) => {
    const input = value.trim().toLowerCase();
    return input.length === 0
      ? []
      : airports.filter(
          (a) =>
            a.name.toLowerCase().includes(input) ||
            a.code.toLowerCase().includes(input)
        );
  };

  const getSuggestionValue = (suggestion) => suggestion.code;
  const renderSuggestion = (suggestion) => (
    <div className="p-2 hover:bg-blue-50 cursor-pointer">
      {suggestion.name}{" "}
      <span className="text-gray-400">({suggestion.code})</span>
    </div>
  );

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // 🟢 Căutare zboruri
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (loading) return; // 🧱 oprește apelurile multiple

    if (!from || !to || !depart || !ret) {
      alert("Completează toate câmpurile!");
      return;
    }

    setFlights([]);
    setLoading(true); // 🔵 marcam că începe căutarea

    const url = `http://localhost:3000/flights/fetch?from=${from}&to=${to}&depart=${depart}&ret=${ret}&adults=${passengers}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const uniqueFlights = data.data.filter(
          (v, i, self) =>
            i ===
            self.findIndex(
              (z) => z.from === v.from && z.to === v.to && z.price === v.price
            )
        );

        const sortedFlights = uniqueFlights.sort((a, b) => a.price - b.price);
        const limitedFlights = sortedFlights.slice(0, 20);

        setFlights(limitedFlights);
      } else {
        alert("Nu s-au găsit zboruri 😕");
        setFlights([]);
      }
    } catch (error) {
      console.error("Eroare la căutarea zborurilor:", error);
      alert("Eroare la conexiunea cu serverul.");
    } finally {
      setLoading(false); // 🔵 căutarea s-a terminat
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">
        Caută bilete de avion ✈️
      </h1>

      {/* 🔹 Formular de căutare */}
      <form
        onSubmit={handleSearch}
        className="bg-white shadow-lg rounded-2xl p-6 flex flex-wrap justify-center gap-6 max-w-6xl w-full"
      >
        {/* From */}
        <div className="flex flex-col w-full md:w-80">
          <label className="text-gray-700 font-medium mb-1">De unde</label>
          <Autosuggest
            suggestions={fromSuggestions}
            onSuggestionsFetchRequested={({ value }) =>
              setFromSuggestions(getSuggestions(value))
            }
            onSuggestionsClearRequested={() => setFromSuggestions([])}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: "Ex: Bucharest / OTP",
              value: from,
              onChange: (_, { newValue }) => setFrom(newValue),
              className:
                "border rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full",
            }}
          />
        </div>

        {/* To */}
        <div className="flex flex-col w-full md:w-80">
          <label className="text-gray-700 font-medium mb-1">Destinația</label>
          <Autosuggest
            suggestions={toSuggestions}
            onSuggestionsFetchRequested={({ value }) =>
              setToSuggestions(getSuggestions(value))
            }
            onSuggestionsClearRequested={() => setToSuggestions([])}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: "Ex: Bologna / BLQ",
              value: to,
              onChange: (_, { newValue }) => setTo(newValue),
              className:
                "border rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full",
            }}
          />
        </div>

        {/* Dates */}
        <div className="flex flex-col w-52">
          <label className="text-gray-700 font-medium mb-1">Plecare</label>
          <input
            type="date"
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
            className="border rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col w-52">
          <label className="text-gray-700 font-medium mb-1">Întoarcere</label>
          <input
            type="date"
            value={ret}
            onChange={(e) => setRet(e.target.value)}
            className="border rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Passengers */}
        <div className="flex flex-col w-40">
          <label className="text-gray-700 font-medium mb-1">Pasageri</label>
          <input
            type="number"
            min="1"
            max="10"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="border rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition-all self-end md:self-center"
        >
          Caută zboruri
        </button>
      </form>

      {/* 🔹 Rezultate */}
      <div className="mt-10 grid gap-4 w-full max-w-5xl">
        {flights.length > 0 ? (
          flights.map((f, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center border-l-4 border-blue-400"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {f.from} → {f.to}
                </p>

                <p className="text-gray-600">
                  <b>Plecare:</b> {new Date(f.departDate).toLocaleString()}
                </p>

                {f.returnDate && (
                  <p className="text-gray-600">
                    <b>Întoarcere:</b> {new Date(f.returnDate).toLocaleString()}
                  </p>
                )}

                <p className="text-blue-700 mt-1">
                  {f.airline} {f.airlineReturn && `/ ${f.airlineReturn}`}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {f.price.toFixed(2)}$
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-lg">
            Nu există zboruri de afișat.
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
