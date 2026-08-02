import { Brain, Menu, X, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const baseLinks = [
    { label: "Home", path: "/" },
  ];

  const studentLinks = [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Chat", path: "/chat" },
  ];

  const teacherLinks = [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "Upload", path: "/upload" },
  ];

  const authLinks = user?.role === 'teacher' ? teacherLinks : studentLinks;
  const navLinks = isAuthenticated ? [...baseLinks, ...authLinks] : baseLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="gradient-bg rounded-lg p-1.5">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="gradient-text">SmartClass AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground border border-border/50 px-3 py-1.5 rounded-full">{user?.name}</span>
              <Button size="icon" variant="ghost" onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" className="gradient-bg border-0" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <Button size="sm" variant="destructive" onClick={() => { logout(); setMobileOpen(false); }} className="mt-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button size="sm" className="gradient-bg border-0 mt-2" asChild>
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
