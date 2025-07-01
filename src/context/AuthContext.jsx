import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.post("/api/users/verify", { token });
        if (res?.status === 200) {
          const name = res.data?.data?.name;
          setUser({ token, name });
        } else {
          localStorage.removeItem("auth_token");
        }
      } catch (err) {
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });

      const data = res?.data?.data;
      const token = data?.token;
      const name = data?.name;

      if (token) {
        localStorage.setItem("auth_token", token);
        setUser({ token, name });
        return { success: true };
      }
    } catch (err) {
      const errorMessages =
        err?.response?.data?.error?.length > 0
          ? err.response.data.error.join(", ")
          : err?.response?.data?.message || "Something went wrong";

      return { success: false, error: errorMessages };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/users/register", {
        name,
        email,
        password,
      });

      const data = res?.data?.data;
      const token = data?.token;
      const userName = data?.name;

      if (token) {
        localStorage.setItem("auth_token", token);
        setUser({ token, name: userName });
        return { success: true };
      }
    } catch (err) {
      const errorMessages =
        err?.response?.data?.error?.length > 0
          ? err.response.data.error.join(", ")
          : err?.response?.data?.message || "Something went wrong";

      return { success: false, error: errorMessages };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const value = { user, login, register, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
