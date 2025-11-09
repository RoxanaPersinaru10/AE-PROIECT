import React, { useState, useEffect } from "react";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const API_URL = "http://localhost:3000/users";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 🧩 Reîncarcă tokenul automat când se schimbă în localStorage (ex: după login)
  useEffect(() => {
    const checkToken = () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken !== token) {
        console.log("🔁 Token actualizat din localStorage:", savedToken);
        setToken(savedToken || "");
      }
    };

    // ascultă evenimentele de schimbare
    window.addEventListener("storage", checkToken);
    // verifică imediat la montare
    checkToken();

    return () => window.removeEventListener("storage", checkToken);
  }, [token]);

  // 🔹 Preia toți utilizatorii
  const getUsers = async () => {
    try {
      console.log("🔑 Token folosit la fetch:", token);
      const res = await fetch(API_URL, { headers });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setMessage("Utilizatori încărcați ✅");
      } else {
        setMessage(data.message || "Eroare la preluare utilizatori");
      }
    } catch (err) {
      setMessage("Eroare de rețea");
    }
  };

  // 🔹 Creează utilizator
  const createUser = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Utilizator creat ✅");
        getUsers();
      } else setMessage(data.message);
    } catch (err) {
      setMessage("Eroare la creare utilizator");
    }
  };

  // 🔹 Actualizează utilizator
  // 🔹 Actualizează utilizator
    const updateUser = async () => {
    if (!form.id) return setMessage("Introdu ID-ul pentru actualizare");

    try {
        // 🔧 Eliminăm câmpurile goale — trimitem doar ce a fost completat
        const filteredData = Object.entries(form).reduce((acc, [key, value]) => {
        if (value !== "" && key !== "id") {
            acc[key] = value;
        }
        return acc;
        }, {});

        // Dacă nu e completat niciun câmp, ieșim
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
        setMessage("Utilizator actualizat ✅");
        getUsers();
        } else {
        setMessage(data.message || "Eroare la actualizare");
        }
    } catch (err) {
        setMessage("Eroare la actualizare");
    }
    };


  // 🔹 Șterge utilizator
  const deleteUser = async (id) => {
    if (!id) return;
    if (!window.confirm("Sigur vrei să ștergi utilizatorul?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Utilizator șters ❌");
        getUsers();
      } else setMessage(data.message);
    } catch (err) {
      setMessage("Eroare la ștergere");
    }
  };

  // 🔁 Când tokenul se schimbă, se încarcă automat utilizatorii
  useEffect(() => {
    console.log("🔑 Token curent:", token);
    if (token) getUsers();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        🔧 Administrare Utilizatori
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
          placeholder="Nume"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Parolă"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={createUser}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Crează
          </button>
          <button
            onClick={updateUser}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Actualizează
          </button>
          <button
            onClick={getUsers}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Afișează toți
          </button>
        </div>
      </div>

      {message && (
        <p className="text-center text-gray-700 mb-6 font-semibold">{message}</p>
      )}

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Lista utilizatori</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nume</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Rol</th>
              <th className="border p-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-100">
                  <td className="border p-2">{u.id}</td>
                  <td className="border p-2">{u.name}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2">{u.role}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      🗑️ Șterge
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-3 text-gray-500">
                  Niciun utilizator încă
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManager;
