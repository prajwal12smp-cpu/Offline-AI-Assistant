import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Brain,
  Wifi,
  BookOpen,
  Search,
  UserCheck,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { AntigravityBackground } from "@/components/AntigravityBackground";
import { useEffect } from "react";

const features = [
  { icon: Brain, title: "Offline AI Chat", desc: "Ask questions and get instant AI-powered answers without internet." },
  { icon: BookOpen, title: "Subject-wise Learning", desc: "Curated content for Science, Maths, SST, and English." },
  { icon: Search, title: "Fast RAG Search", desc: "Retrieve answers from your study materials in milliseconds." },
  { icon: UserCheck, title: "Personalized Learning", desc: "AI adapts to your learning style and pace." },
];

const steps = [
  { num: "01", title: "Upload Materials", desc: "Add your textbooks and notes to the system." },
  { num: "02", title: "Ask Questions", desc: "Type or speak your doubts to the AI assistant." },
  { num: "03", title: "Get Answers", desc: "Receive context-aware answers from your materials." },
  { num: "04", title: "Track Progress", desc: "Review your learning history and improve." },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Force dark mode for Antigravity theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-primary/30 text-foreground bg-background">
      <AntigravityBackground />
      <div className="relative z-10 glass-panel border-b-0 border-x-0 rounded-none bg-background/20 backdrop-blur-md">
        <Navbar />
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 text-center z-10">
        <div className="container relative">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel border-primary/30 text-sm font-medium mb-8 glow-primary shadow-lg shadow-primary/20 bg-background/40 backdrop-blur-xl">
            <Wifi className="h-4 w-4 text-primary" />
            <span className="text-white tracking-wide font-light">Zero-Gravity Learning Space</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter max-w-5xl mx-auto leading-tight drop-shadow-2xl">
            <span className="text-white">Offline AI</span>
            <br />
            <span className="gradient-text glow-text">Smart Classroom</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="mt-8 text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Break the laws of physics. Learn smarter with an AI assistant that works in deep space—no internet required.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="gradient-bg border-0 text-lg px-10 h-14 rounded-full glow-primary hover:scale-105 transition-all duration-300" asChild>
              <Link to="/auth">
                Initiate Sequence <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 h-14 rounded-full glass-panel border-white/20 hover:bg-white/10 hover:text-white transition-all duration-300" asChild>
              <a href="#features">Scan Features</a>
            </Button>
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="mt-24 flex flex-wrap justify-center gap-10 text-muted-foreground text-sm font-medium tracking-wide">
            <div className="flex items-center gap-3"><Zap className="h-5 w-5 text-zinc-400" /> SYNAPTIC SPEED</div>
            <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-zinc-300" /> 100% ENCRYPTED</div>
            <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-zinc-400" /> ALWAYS ONLINE</div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative z-10 w-full">
        <div className="container relative">
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Core Modules</h2>
            <div className="h-1 w-24 gradient-bg mx-auto mt-6 rounded-full opacity-50 glow-accent" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={f.title} 
                {...fadeUp(i * 0.15)} 
                className="glass-card rounded-2xl p-8 hover:bg-white/10 hover:border-primary/50 transition-all duration-500 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-14 w-14 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 glow-primary">
                  <f.icon className="h-7 w-7 text-black drop-shadow-md" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-white">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works with slight parallax */}
      <section className="py-32 relative z-10 w-full overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent w-full opacity-20" />
        
        <motion.div style={{ y: yParallax }} className="container relative">
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Deployment Steps</h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-lg font-light">4 phases to complete knowledge integration</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num} {...fadeUp(i * 0.15)} className="text-center relative group">
                <div className="text-7xl font-black gradient-text opacity-50 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {s.num}
                </div>
                <h3 className="font-semibold text-xl mt-6 mb-3 text-white">{s.title}</h3>
                <p className="text-muted-foreground font-light">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-32 relative z-10 w-full">
        <div className="container max-w-5xl">
          <motion.div {...fadeUp(0)} className="glass-card rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border-primary/30 glow-primary">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
             <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Defy Gravity?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 font-light">
                Launch your offline AI learning experience today.
              </p>
              <Button size="lg" className="text-lg px-12 h-14 rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]" asChild>
                <Link to="/auth">Engage Thrusters <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 relative z-10 glass-panel rounded-none border-b-0 border-x-0 bg-background/40 backdrop-blur-xl">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-light relative">
          <div className="flex items-center gap-3 font-medium text-white">
            <div className="gradient-bg rounded-xl p-2 glow-primary">
              <Brain className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg tracking-wide">SmartClass AI</span>
          </div>

          <p className="opacity-60 md:absolute md:left-1/2 md:-translate-x-1/2">© 2026 SmartClass AI. End of transmission.</p>
        </div>
      </footer>
    </div>
  );
}
