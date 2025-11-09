import React, { useState, useEffect } from "react";

function FlightManager() {
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [form, setForm] = useState({
    id: "",
    from: "",
    to: "",
    date: "",
    return_date: "",
    airline: "",
    airline_return: "",
    price: "",
  });

  const API_URL = "http://localhost:3000/flights";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 🧩 Reîncarcă tokenul dacă se schimbă în localStorage
  useEffect(() => {
    const checkToken = () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken !== token) setToken(savedToken || "");
    };
    window.addEventListener("storage", checkToken);
    checkToken();
    return () => window.removeEventListener("storage", checkToken);
  }, [token]);

  // 🔹 Preia toate zborurile
  const getFlights = async () => {
    try {
      const res = await fetch(`${API_URL}/all`, { headers });
      const data = await res.json();
      if (data.success) {
        setFlights(data.data);
        setMessage("Zboruri încărcate ✅");
      } else setMessage(data.message);
    } catch (err) {
      setMessage("Eroare la preluarea zborurilor ❌");
    }
  };

  // 🔹 Creează zbor
  const createFlight = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Zbor adăugat ✈️");
        getFlights();
      } else setMessage(data.message);
    } catch (err) {
      setMessage("Eroare la creare zbor");
    }
  };

  // 🔹 Actualizează zbor
  const updateFlight = async () => {
    if (!form.id) return setMessage("Introdu ID-ul pentru actualizare");

    try {
        // 🔧 Trimite doar câmpurile completate (ignoră cele goale)
        const filteredData = Object.entries(form).reduce((acc, [key, value]) => {
        if (value !== "" && key !== "id") acc[key] = value;
        return acc;
        }, {});

        if (Object.keys(filteredData).length === 0) {
        return setMessage("Completează cel puțin un câmp pentru actualizare");
        }

        const res = await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(filteredData),
        });

        const data = await res.json();
        if (data.success) {
        setMessage("Zbor actualizat ✅");
        getFlights();
        } else {
        setMessage(data.message || "Eroare la actualizare");
        }
    } catch (err) {
        setMessage("Eroare la actualizare zbor");
    }
   };

  // 🔹 Șterge zbor
  const deleteFlight = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi zborul?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Zbor șters ❌");
        getFlights();
      } else setMessage(data.message);
    } catch (err) {
      setMessage("Eroare la ștergere zbor");
    }
  };

  useEffect(() => {
    if (token) getFlights();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        ✈️ Administrare Zboruri
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Formular CRUD</h2>

        <input
          type="number"
          placeholder="ID (doar pt update/delete)"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="De unde"
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Destinația"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="datetime-local"
          placeholder="Data plecare"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="datetime-local"
          placeholder="Data întoarcere"
          value={form.return_date}
          onChange={(e) => setForm({ ...form, return_date: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Companie plecare"
          value={form.airline}
          onChange={(e) => setForm({ ...form, airline: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Companie întoarcere"
          value={form.airline_return}
          onChange={(e) => setForm({ ...form, airline_return: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="number"
          placeholder="Preț"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />

        <div className="flex gap-3">
          <button
            onClick={createFlight}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Adaugă
          </button>
          <button
            onClick={updateFlight}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Actualizează
          </button>
          <button
            onClick={getFlights}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Afișează toate
          </button>
        </div>
      </div>

      {message && (
        <p className="text-center text-gray-700 mb-6 font-semibold">{message}</p>
      )}

      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Lista zboruri</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">ID</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Return</th>
              <th className="border p-2">Airline</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {flights.length > 0 ? (
              flights.map((f) => (
                <tr key={f.id} className="hover:bg-gray-100">
                  <td className="border p-2">{f.id}</td>
                  <td className="border p-2">{f.from}</td>
                  <td className="border p-2">{f.to}</td>
                  <td className="border p-2">{new Date(f.date).toLocaleString()}</td>
                  <td className="border p-2">
                    {f.return_date ? new Date(f.return_date).toLocaleString() : "-"}
                  </td>
                  <td className="border p-2">{f.airline}</td>
                  <td className="border p-2 text-green-700 font-semibold">{f.price}$</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteFlight(f.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-3 text-gray-500">
                  Niciun zbor găsit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FlightManager;
