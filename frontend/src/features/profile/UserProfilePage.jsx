import { useEffect, useState } from "react";
import api from "../../api";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    api.get("/user/profile").then((res) => setUser(res.data));
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/change-password", passwordForm);
      alert("Password updated successfully");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      alert("Failed to change password");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
  <div className="max-w-xl mx-auto bg-black text-[#D4AF37] p-6 rounded shadow min-h-screen">
    <h2 className="text-2xl font-bold mb-4">User Profile & Settings</h2>

    <div className="mb-6">
      <h3 className="font-semibold mb-1">Account Info</h3>
      <p>Email: {user.email}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>

    <div className="mb-6">
      <h3 className="font-semibold mb-1">Dark Mode</h3>
      <button
        onClick={toggleDarkMode}
        className="mt-2 px-4 py-2 rounded bg-[#1a1a1a] border border-[#D4AF37] hover:bg-[#2a2a2a] text-[#D4AF37]"
      >
        {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
      </button>
    </div>

    <div>
      <h3 className="font-semibold mb-2">Change Password</h3>
      <form onSubmit={handleChangePassword} className="space-y-3">
        <input
          type="password"
          placeholder="Current Password"
          value={passwordForm.oldPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
          }
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full placeholder-[#D4AF37]/70"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
          }
          className="border border-[#D4AF37] bg-black text-[#D4AF37] px-3 py-2 rounded w-full placeholder-[#D4AF37]/70"
          required
        />
        <button
          type="submit"
          className="bg-[#D4AF37] text-black px-4 py-2 rounded hover:bg-[#FFD700]"
        >
          Update Password
        </button>
      </form>
    </div>
  </div>
);
}
