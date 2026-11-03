import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  return (
    <header className="bg-pup-maroon text-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold">
          PUP <span className="text-pup-gold">LMS</span>
        </h1>
        <div className="flex items-center gap-3 text-sm">
          {user && (
            <span className="hidden sm:inline">
              {user.name} · {user.role}
            </span>
          )}
          <button
            onClick={toggleTheme}
            className="rounded border border-pup-gold px-2 py-1 hover:bg-white/10"
          >
            {dark ? "Light" : "Dark"}
          </button>
          {user && (
            <button
              onClick={logout}
              className="rounded bg-pup-gold px-3 py-1 font-semibold text-pup-maroon"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}