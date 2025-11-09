import React from "react";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      <h1 className="text-4xl font-bold mb-10 text-blue-800 text-center">
        ✈️ Bine ai venit în aplicația de zboruri!
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 🔹 Buton pentru căutare zboruri — disponibil mereu */}
        <button
          onClick={() => navigate("/flights")}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
        >
          🔍 Caută zboruri
        </button>

        {/* 🔹 Dacă nu e logat — doar butonul de autentificare */}
        {!token ? (
          <button
            onClick={() => navigate("/auth")}
            className="bg-green-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-green-700 transition-all shadow-md"
          >
            🔑 Autentificare
          </button>
        ) : (
          <>
            {/* 🔹 Dacă e logat — apare CRUD + Logout */}
            <button
              onClick={() => navigate("/users")}
              className="bg-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-indigo-600 transition-all shadow-md"
            >
              👥 Operații CRUD Utilizatori
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-red-600 transition-all shadow-md"
            >
              🔒 Logout
            </button>
            <button
                onClick={() => navigate("/flights-manager")}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
              >
                ✈️ Operații CRUD Zboruri
            </button>

          </>
        )}
      </div>

      {/* Info text */}
      <p className="mt-10 text-gray-600 text-center max-w-lg">
        Poți căuta liber zboruri fără să fii autentificat. Dacă vrei să gestionezi
        utilizatori sau date protejate, autentifică-te pentru a accesa secțiunea
        dedicată operațiilor CRUD.
      </p>
    </div>
  );
}

export default Homepage;
