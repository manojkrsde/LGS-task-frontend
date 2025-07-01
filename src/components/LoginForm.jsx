import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function LoginForm({ onSuccess }) {
  const { login, loading } = useAuth();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      toast.success("Login successful!");
      onSuccess();
    } else {
      toast.error(result.error);
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="text"
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="Enter email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
