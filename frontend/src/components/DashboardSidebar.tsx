import { Brain, Home, MessageSquare, Upload, Search, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function DashboardSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const studentLinks = [
    { label: "Dashboard", path: "/student/dashboard", icon: Home },
    { label: "AI Chat", path: "/chat", icon: MessageSquare },
  ];

  const teacherLinks = [
    { label: "Dashboard", path: "/teacher/dashboard", icon: Home },
    { label: "Upload Material", path: "/upload", icon: Upload },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="gradient-bg rounded-lg p-1.5">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="gradient-text text-sm">SmartClass AI</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
