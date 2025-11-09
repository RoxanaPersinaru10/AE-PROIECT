import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">🌍 Home</Link>
      </div>
      <div className="flex gap-4">
        {token ? (
          <>
            <Link to="/users" className="hover:underline">
              👥 Utilizatori
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/auth";
              }}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="hover:underline">
            🔐 Autentificare
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
