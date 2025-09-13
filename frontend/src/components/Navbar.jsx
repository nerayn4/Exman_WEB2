import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-[#2a2a2a] text-[#D4AF37] py-6 shadow-md">
      <div className="max-w-screen-xl mx-auto px-8 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold tracking-wide hover:text-[#FFD700]">
          ExpenseTracker
        </Link>

        <div className="flex items-center gap-6">
          {token ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="hover:text-[#FFD700] px-4 py-2 rounded-md border border-[#D4AF37]"
                >
                  Features ▾
                </button>
                {open && (
                  <div className="absolute mt-2 bg-[#1a1a1a] text-[#D4AF37] rounded-md shadow-lg w-48 z-50 border border-[#333]">
                    {[
                      { label: "Dashboard", path: "/" },
                      { label: "Expenses", path: "/expenses" },
                      { label: "Incomes", path: "/incomes" },
                      { label: "Categories", path: "/categories" },
                      { label: "Profile", path: "/profile" },
                    ].map(({ label, path }) => (
                      <Link
                        key={path}
                        to={path}
                        className="block px-4 py-2 hover:bg-[#2a2a2a]"
                        onClick={() => setOpen(false)}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-[#D4AF37] text-black px-4 py-2 rounded-md hover:bg-[#FFD700]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#FFD700] text-black px-4 py-2 rounded-md hover:bg-[#D4AF37]"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
