import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Upload,
  BookOpen,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "Upload Notes / PDFs", icon: Upload, path: "/upload" },
  { label: "Manage Quizzes", icon: BookOpen, path: "/teacher/quizzes" },
  { label: "Student Activity", icon: Users, path: "/teacher/students" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-5xl">
        <motion.div {...fade(0)}>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name} 👋</h1>
          <p className="text-muted-foreground mt-1">Manage your classroom materials and question bank.</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fade(0.1)} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.path}
              className="group glass-card rounded-xl p-5 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <div className={`h-10 w-10 rounded-lg bg-zinc-800/60 border border-zinc-600/30 group-hover:border-zinc-400/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300`}>
                  <a.icon className="h-5 w-5 text-zinc-300 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-sm">{a.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">Open tool →</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
