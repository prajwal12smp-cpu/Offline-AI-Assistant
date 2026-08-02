import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Beaker,
  Calculator,
  Globe,
  BookOpen,
  MessageSquare,
  Search,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const subjects = [
  { name: "Science", icon: Beaker, color: "bg-zinc-800/60 border border-zinc-600/30 group-hover:border-zinc-400/50", path: "/chat?subject=science" },
  { name: "Mathematics", icon: Calculator, color: "bg-zinc-800/60 border border-zinc-600/30 group-hover:border-zinc-400/50", path: "/chat?subject=maths" },
  { name: "Social Science", icon: Globe, color: "bg-zinc-800/60 border border-zinc-600/30 group-hover:border-zinc-400/50", path: "/chat?subject=sst" },
  { name: "English", icon: BookOpen, color: "bg-zinc-800/60 border border-zinc-600/30 group-hover:border-zinc-400/50", path: "/chat?subject=english" },
];

const quickActions = [
  { label: "Ask AI", icon: MessageSquare, path: "/chat" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function StudentDashboard() {
  const [recentSearches, setRecentSearches] = useState<Record<string, string[]>>({});
  const { user } = useAuth();

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const histories: Record<string, string[]> = {};
        for (const s of subjects) {
          const subjectId = s.path.split("=")[1] || "science";
          const history = await api.fetchChatHistory(`${user?.id}_${subjectId}`);
          const userMessages = history
            .filter((msg) => msg.role === "user")
            .map((msg) => msg.content)
            .reverse();
          histories[s.name] = Array.from(new Set(userMessages)).slice(0, 3);
        }
        setRecentSearches(histories);
      } catch (err) {
        console.error("Failed to load recent searches:", err);
      }
    };
    if (user?.id) {
      loadRecentSearches();
    }
  }, [user?.id]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-5xl">
        <motion.div {...fade(0)}>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || "Student"} 👋</h1>
          <p className="text-muted-foreground mt-1">Pick a subject or launch the universal AI assistant.</p>
        </motion.div>

        {/* Subject Cards */}
        <motion.div {...fade(0.1)} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((s) => (
            <Link
              key={s.name}
              to={s.path}
              className="group glass-card rounded-xl p-5 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <div className={`h-10 w-10 rounded-lg ${s.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300`}>
                  <s.icon className="h-5 w-5 text-zinc-300 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-sm">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Start learning →</p>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fade(0.2)} className="mt-8 flex gap-3">
          {quickActions.map((a) => (
            <Button key={a.label} variant="outline" className="gap-2" asChild>
              <Link to={a.path}>
                <a.icon className="h-4 w-4" />
                {a.label}
              </Link>
            </Button>
          ))}
        </motion.div>

        {/* Recent Searches Header */}
        <motion.div {...fade(0.3)} className="mt-10">
          <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Chat History by Subject</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {subjects.map((s) => {
              const searches = recentSearches[s.name] || [];
              const subjectId = s.path.split("=")[1];
              return (
                <div key={s.name} className="bg-card/30 border border-border/40 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm text-foreground/80">{s.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {searches.length > 0 ? (
                      searches.map((q, i) => (
                        <Link
                          key={i}
                          to={`/chat?subject=${subjectId}&q=${encodeURIComponent(q)}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-md bg-background/50 hover:bg-accent/40 transition-colors text-sm"
                        >
                          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate text-muted-foreground hover:text-foreground transition-colors">{q}</span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic pl-1">No chats yet.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
