import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      {loading ? <p className="p-8 text-center">Loading...</p> : user ? <Dashboard /> : <Login />}
    </div>
  );
}