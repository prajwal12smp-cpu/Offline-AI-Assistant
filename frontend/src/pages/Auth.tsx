import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AntigravityBackground } from '@/components/AntigravityBackground';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosClient from '@/lib/axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const body = isLogin 
        ? { email, password } 
        : { name, email, password, role };

      const res = await axiosClient.post(endpoint, body);
      const data = res.data;

      login(data.access_token, data.user);
      
      toast({
        title: "Success!",
        description: `Welcome back, ${data.user.name}`,
      });

      if (from) {
        navigate(from, { replace: true });
      } else {
        if (data.user.role === 'teacher') {
          navigate('/teacher/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      }

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background text-foreground selection:bg-primary/30 p-4">
      <AntigravityBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl gradient-bg flex items-center justify-center mb-4 glow-primary">
            <Brain className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-white">SmartClass AI</h2>
          <p className="text-muted-foreground mt-2">
            {isLogin ? 'Enter the learning zone' : 'Create your access credential'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Full Name</label>
              <Input
                required
                placeholder="John Doe"
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary/50 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Vector</label>
            <Input
              required
              type="email"
              placeholder="name@example.com"
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary/50 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Security Passcode</label>
            <Input
              required
              type="password"
              placeholder="••••••••"
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary/50 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Access Level</label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={role === 'student' ? 'default' : 'outline'}
                  className={`flex-1 rounded-full ${role === 'student' ? 'gradient-bg font-bold' : 'border-zinc-700 hover:bg-zinc-800'}`}
                  onClick={() => setRole('student')}
                >
                  Student
                </Button>
                <Button
                  type="button"
                  variant={role === 'teacher' ? 'default' : 'outline'}
                  className={`flex-1 rounded-full ${role === 'teacher' ? 'gradient-bg font-bold' : 'border-zinc-700 hover:bg-zinc-800'}`}
                  onClick={() => setRole('teacher')}
                >
                  Teacher
                </Button>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 rounded-full gradient-bg mt-6 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Initiate Login' : 'Register Access')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:text-white transition-colors"
            type="button"
          >
            {isLogin ? "Don't have an access credential? Register" : "Already registered? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
