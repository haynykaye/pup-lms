import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // Client-side validation before calling the API
    if (!email.trim()) return toast("Email is required.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast("Enter a valid email address.");
    if (!password) return toast("Password is required.");

    setBusy(true);
    try {
      await login(email.trim(), password);
      toast("Welcome back!", "success");
    } catch (err) {
      toast(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto mt-16 w-full max-w-sm px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border-t-4 border-pup-gold bg-white p-6 shadow-lg dark:bg-gray-800"
      >
        <h2 className="mb-1 text-2xl font-bold text-pup-maroon dark:text-pup-gold">Sign in</h2>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">Use your PUP LMS account.</p>

        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-pup-maroon focus:outline-none"
          placeholder="you@pup.edu.ph"
        />

        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-pup-maroon focus:outline-none"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-pup-maroon py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}