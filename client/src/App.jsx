
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import "./App.css";

const API = "http://localhost:5000/api";

function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message || "Cannot connect to server. Check the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-card">
      <h1>TaskMatrix</h1>
      <p>{isRegister ? "Create your account" : "Welcome back"}</p>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          type="email"
          placeholder="Email address"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password (minimum 8 characters)"
          minLength={8}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Create account" : "Log in"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <p>
        {isRegister ? "Already registered? " : "New here? "}
        <Link to={isRegister ? "/login" : "/register"}>
          {isRegister ? "Log in" : "Create an account"}
        </Link>
      </p>
    </main>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [status, setStatus] = useState("");

  async function checkProtectedRoute() {
    try {
      const response = await fetch(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");
      setStatus(data.message);
    } catch (error) {
      setStatus(error.message || "Could not connect to the backend.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <main className="dashboard">
      <h1>TaskMatrix</h1>
      <p>Welcome, {user.name || "User"}!</p>
      <p>You are logged in.</p>
      <button onClick={checkProtectedRoute}>Test protected API</button>
      {status && <p className="message">{status}</p>}
      <button className="secondary" onClick={logout}>Log out</button>
    </main>
  );
}

function ProtectedRoute({ children }) {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
