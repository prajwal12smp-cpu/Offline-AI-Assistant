import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send, Trash2, Bot, User, Beaker, Calculator, Globe, BookOpen, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const subjectMeta: Record<string, { label: string; icon: React.ElementType; greeting: string }> = {
  science: { label: "Science", icon: Beaker, greeting: "Ask me anything about Physics, Chemistry, or Biology!" },
  maths: { label: "Mathematics", icon: Calculator, greeting: "Ready to solve equations and explore geometry!" },
  sst: { label: "Social Science", icon: Globe, greeting: "Let's explore History, Geography, and Civics!" },
  english: { label: "English", icon: BookOpen, greeting: "Ask about grammar, literature, or writing!" },
  general: { label: "Universal AI", icon: Bot, greeting: "Ask me anything! I am your universal AI assistant." },
};

export default function Chat() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const subject = params.get("subject") || "general";
  const userId = user?.id ? `${user.id}_${subject}` : `guest_student_${subject}`;
  const meta = subjectMeta[subject] || subjectMeta.general;
  const SubjectIcon = meta.icon;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(params.get("q") || "");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);
  const [language, setLanguage] = useState("English");
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          const langCode = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : language === "Tamil" ? "ta-IN" : language === "Telugu" ? "te-IN" : language === "Kannada" ? "kn-IN" : "en-IN";
          recognitionRef.current.lang = langCode;
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const speakText = (text: string) => {
    if (!speechSynthesisEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // cancel current speech
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : language === "Tamil" ? "ta-IN" : language === "Telugu" ? "te-IN" : language === "Kannada" ? "kn-IN" : "en-IN";
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Fetch initial chat history
    const loadHistory = async () => {
      setMessages([]); // Clear old subject's messages immediately
      try {
        const history = await api.fetchChatHistory(userId);
        setMessages(history.map((msg, idx) => ({
          id: msg.timestamp || idx.toString(),
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        })));
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    loadHistory();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const currentInput = input.trim();
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: currentInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const { response } = await api.sendChatMessage(currentInput, userId, false, subject, language);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(response);
    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I had trouble connecting to the server.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = async () => {
    try {
      await api.clearChatHistory(userId);
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="gradient-bg rounded-lg p-1.5 glow-primary">
              <SubjectIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">{meta.label} Chat</h2>
              <p className="text-xs text-muted-foreground">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Marathi">Marathi</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Kannada">Kannada</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => {
                setSpeechSynthesisEnabled(!speechSynthesisEnabled);
                if (speechSynthesisEnabled) window.speechSynthesis.cancel();
              }}
              title={speechSynthesisEnabled ? "Mute AI" : "Unmute AI"}
            >
              {speechSynthesisEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleClear}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="gradient-bg rounded-2xl p-4 mb-4 animate-float glow-primary">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{meta.label} Assistant</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">{meta.greeting}</p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="shrink-0 h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "gradient-bg text-primary-foreground rounded-br-md"
                      : "bg-card border border-border rounded-bl-md"
                  }`}
                >
                  {msg.content.split("\n").map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                  ))}
                </div>
                {msg.role === "user" && (
                  <div className="shrink-0 h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-3">
              <div className="shrink-0 h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border px-6 py-4">
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              variant={isListening ? "destructive" : "secondary"}
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Start Voice Input"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              className="gradient-bg border-0 h-11 w-11 shrink-0"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
