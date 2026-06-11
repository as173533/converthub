import { FileClock, LayoutDashboard, LogOut, Shield, Sparkles, UploadCloud, Wand2 } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/tools", "Tools", Wand2],
  ["/upload", "Upload", UploadCloud],
  ["/pdf-editor", "PDF Editor", Sparkles],
  ["/history", "History", FileClock]
];

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-5">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-900 font-black text-white">CH</div>
          <div>
            <strong className="block">ConvertHub Pro</strong>
            <span className="text-sm text-slate-500">Laravel workspace</span>
          </div>
        </div>
        <nav className="grid gap-2">
          {nav.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 font-semibold ${isActive ? "bg-teal-50 text-teal-700" : "text-slate-600"}`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          {user?.is_admin && (
            <NavLink to="/admin" className="flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-slate-600">
              <Shield size={18} /> Admin
            </NavLink>
          )}
        </nav>
        <button
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 font-bold"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="min-w-0">
        <header className="flex justify-end border-b border-slate-200 bg-white px-6 py-4">
          <div className="text-right">
            <span className="block text-xs font-bold uppercase text-teal-700">Signed in</span>
            <strong>{user?.name}</strong>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

