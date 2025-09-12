import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { email, password });
      navigate("/login");
    } catch {
      alert("Signup échoué");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] shadow-xl rounded-lg p-8 w-96 flex flex-col gap-5 border border-[#D4AF37]"
      >
        <h1 className="text-2xl font-[Orbitron] text-[#D4AF37] text-center tracking-wide">
          Créer un compte
        </h1>

        <input
          className="bg-black border border-[#D4AF37] text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-black border border-[#D4AF37] text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-[#D4AF37] text-black font-semibold rounded py-3 hover:bg-[#c9a233] transition duration-200"
        >
          S’inscrire
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
