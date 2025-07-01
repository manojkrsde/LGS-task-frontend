import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function RegisterForm({ onSuccess }) {
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      toast.success("Account created!");
      onSuccess();
    } else {
      toast.error(result.error);
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
      </div>

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
          placeholder="Create password"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
