import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const CATEGORY_LABELS = {
  CCIS_CORE: "CCIS Core Subjects",
  GENERAL_EDUCATION: "General Education",
  ELECTIVE: "Electives",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [report, setReport] = useState("");
  const [form, setForm] = useState({ code: "", title: "", category: "CCIS_CORE" });

  function handleError(err) {
    if (err.status === 401) {
      toast("Your session expired. Please log in again.");
      logout();
    } else {
      toast(err.message);
    }
  }

  async function loadCourses() {
    try {
      const data = await api("/courses");
      setCourses(data.courses);
      setReport(data.report);
    } catch (err) {
      handleError(err);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function addCourse(e) {
    e.preventDefault();
    if (!form.code.trim() || !form.title.trim()) return toast("Course code and title are required.");
    try {
      await api("/courses", { method: "POST", body: form });
      toast("Course created.", "success");
      setForm({ code: "", title: "", category: "CCIS_CORE" });
      loadCourses();
    } catch (err) {
      handleError(err);
    }
  }

  const input =
    "rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-pup-maroon focus:outline-none";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="text-2xl font-bold text-pup-maroon dark:text-pup-gold">
        {user.role === "FACULTY" ? "Faculty" : user.role === "ADMIN" ? "Admin" : "Student"} Dashboard
      </h2>
      <p className="mb-6 mt-1 rounded bg-pup-gold/20 px-3 py-2 text-sm">{report}</p>

      {user.role === "FACULTY" && (
        <form
          onSubmit={addCourse}
          className="mb-8 grid gap-3 rounded-xl bg-white p-4 shadow dark:bg-gray-800 sm:grid-cols-4"
        >
          <input
            className={input}
            placeholder="Code (e.g. COMP 20123)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            className={input}
            placeholder="Course title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            className={input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="rounded bg-pup-maroon py-2 font-semibold text-white hover:opacity-90">
            Add course
          </button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((c) => (
          <div key={c.id} className="rounded-xl border-l-4 border-pup-gold bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-sm font-semibold text-pup-maroon dark:text-pup-gold">{c.code}</p>
            <h3 className="text-lg font-bold">{c.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {CATEGORY_LABELS[c.category]} · {c.faculty.name}
            </p>
          </div>
        ))}
        {courses.length === 0 && <p className="text-gray-500">No courses yet.</p>}
      </div>
    </main>
  );
}