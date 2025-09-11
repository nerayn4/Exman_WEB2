import { useState } from "react";
import api from "../../api";   
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/expenses");
    } catch {
      alert("Login échoué");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded p-6 w-80 flex flex-col gap-3"
      >
        <h1 className="text-xl font-bold text-center">Connexion</h1>
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white rounded py-2 hover:bg-blue-800">
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
