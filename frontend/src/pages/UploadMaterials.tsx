import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, CloudUpload, Loader2, Download, Book, FileCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, API_BASE_URL } from "@/lib/api";

interface UploadedFile {
  name: string;
  size: string;
  category: string;
  path: string;
}

const categories = [
  { key: "ncert", label: "NCERT Books", icon: Book },
  { key: "past_papers", label: "Past Papers", icon: FileCheck },
  { key: "teacher_upload", label: "Teacher Uploads", icon: GraduationCap },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function UploadMaterials() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");

  const loadMaterials = async () => {
    try {
      const data = await api.fetchMaterials();
      const newFiles = data.map(item => ({
        name: item.title,
        size: item.size,
        category: item.category || "teacher_upload",
        path: item.path || item.title
      }));
      setFiles(newFiles);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleFile = async (file: File, category: string) => {
    setIsUploading((prev) => ({ ...prev, [category]: true }));
    try {
      await api.uploadMaterial(file, category);
      await loadMaterials();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading((prev) => ({ ...prev, [category]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, category: string) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file, category);
  };

  const handleClickUpload = (category: string) => {
    setActiveCategory(category);
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeCategory) {
      handleFile(file, activeCategory);
      e.target.value = ""; // reset
    }
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-5xl">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileInput} 
          accept=".pdf,.txt,.docx"
        />
        <motion.div {...fade(0)}>
          <h1 className="text-2xl font-bold">Upload Study Materials</h1>
          <p className="text-muted-foreground mt-1">Add your textbooks and notes for AI-powered search.</p>
        </motion.div>

        <Tabs defaultValue="ncert" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-secondary">
            {categories.map(c => (
              <TabsTrigger key={c.key} value={c.key} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <c.icon className="w-4 h-4 mr-2" />
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(c => {
            const categoryFiles = files.filter(f => f.category === c.key);
            return (
              <TabsContent key={c.key} value={c.key} className="mt-6">
                <div className="glass-card rounded-xl overflow-hidden max-w-3xl">
                  {/* Drop zone */}
                  <div
                    className={`m-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                      dragOver === c.key
                        ? "border-primary bg-accent/50"
                        : "border-border hover:border-primary/40 hover:bg-accent/20"
                    } ${isUploading[c.key] ? "opacity-50 pointer-events-none" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(c.key); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => handleDrop(e, c.key)}
                    onClick={() => handleClickUpload(c.key)}
                  >
                    {isUploading[c.key] ? (
                      <Loader2 className="h-10 w-10 text-primary mx-auto mb-3 animate-spin" />
                    ) : (
                      <CloudUpload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    )}
                    <p className="text-base text-muted-foreground">
                      {isUploading[c.key] ? "Uploading and processing..." : `Drag & drop or click to upload to ${c.label}`}
                    </p>
                    <p className="text-sm text-muted-foreground/60 mt-2">PDF, DOCX, TXT</p>
                  </div>

                  {/* File list */}
                  {categoryFiles.length > 0 && (
                    <div className="px-6 pb-6 space-y-3">
                      <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">Uploaded Files</h3>
                      {categoryFiles.map((f) => (
                        <div key={f.name} className="flex items-center gap-4 px-4 py-3 rounded-lg bg-secondary/50 text-sm group">
                          <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                          <a 
                            href={`${API_BASE_URL}/files/${f.path}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="truncate flex-1 hover:text-primary transition-colors font-medium hover:underline"
                          >
                            {f.name}
                          </a>
                          <span className="text-xs text-muted-foreground shrink-0 bg-background px-2 py-1 rounded-md">{f.size}</span>
                          <a 
                            href={`${API_BASE_URL}/files/${f.path}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                            title="Download / View"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <button onClick={() => removeFile(f.name)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {categoryFiles.length === 0 && (
                    <p className="px-6 pb-6 text-sm text-muted-foreground text-center">No files uploaded in this category yet.</p>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
