import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <form onSubmit={submit} className="grid w-full max-w-md gap-4 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <span className="text-xs font-black uppercase text-teal-700">ConvertHub Pro</span>
        <h1 className="text-3xl font-black">{isRegister ? "Create account" : "Welcome back"}</h1>
        {isRegister && (
          <label className="grid gap-2 font-semibold">
            Name
            <input className="rounded-lg border border-slate-300 px-3 py-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
        )}
        <label className="grid gap-2 font-semibold">
          Email
          <input className="rounded-lg border border-slate-300 px-3 py-3" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="grid gap-2 font-semibold">
          Password
          <input className="rounded-lg border border-slate-300 px-3 py-3" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        </label>
        {isRegister && (
          <label className="grid gap-2 font-semibold">
            Confirm password
            <input className="rounded-lg border border-slate-300 px-3 py-3" type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required minLength={8} />
          </label>
        )}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button className="rounded-lg bg-teal-700 px-5 py-3 font-bold text-white">{isRegister ? "Register" : "Login"}</button>
        <p className="text-sm text-slate-600">
          {isRegister ? "Already registered?" : "Need an account?"}{" "}
          <Link className="font-bold text-teal-700" to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Register"}</Link>
        </p>
      </form>
    </main>
  );
}

export function Login() {
  return <AuthForm mode="login" />;
}

export function Register() {
  return <AuthForm mode="register" />;
}

