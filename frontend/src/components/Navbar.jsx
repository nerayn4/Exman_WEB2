import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="px-6 py-3 bg-blue-600 text-white flex justify-between items-center shadow-md">
      <div className="flex gap-4">
        {token && (
          <>
            <Link className="hover:underline" to="/expenses">Dépenses</Link>
            <Link className="hover:underline" to="/expenses/new">Nouvelle Dépense</Link>
          </>
        )}
      </div>
      <div className="flex gap-4">
        {!token ? (
          <>
            <Link className="hover:underline" to="/login">Login</Link>
            <Link className="hover:underline" to="/signup">Signup</Link>
          </>
        ) : (
          <button 
            onClick={logout} 
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
