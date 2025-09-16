"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // will hold { id, email } etc.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded); // 👀 check payload
      setUser({ id: decoded.id || decoded.userId, email: decoded.email });
    } catch (err) {
      console.error("Invalid token:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  } else {
    setUser(null);
    setLoading(false);
  }
}, []);


  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, email: decoded.email });
    } catch (err) {
      console.error("Failed to decode token:", err);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
