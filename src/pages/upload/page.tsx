import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  CloudUpload,
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Tag,
  AlignLeft,
  Film,
  Loader2,
  Eye,
  Lock,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/navbar.tsx";
import { CATEGORIES } from "@/lib/video-data.ts";
import { useUploadedVideos } from "@/hooks/use-uploaded-videos.ts";

type Visibility = "public" | "private";

type FormData = {
  title: string;
  description: string;
  category: string;
  tags: string;
  visibility: Visibility;
  thumbnailUrl: string;
  thumbnailFile: File | null;
};

const STEPS = ["Upload", "Details", "Thumbnail", "Publish"] as const;
type Step = (typeof STEPS)[number];

const CONTENT_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

function UploadStep({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("video/")) {
        onFileSelected(file);
      } else {
        toast.error("Please drop a valid video file.");
      }
    },
    [onFileSelected]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-16 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-secondary/40"
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${dragging ? "bg-primary/20" : "bg-secondary"}`}
        >
          <CloudUpload
            className={`w-9 h-9 transition-colors ${dragging ? "text-primary" : "text-muted-foreground"}`}
          />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">
            {dragging ? "Drop to upload" : "Drag & drop your video"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
          <p className="text-xs text-muted-foreground mt-3">MP4, MOV, AVI, MKV - Max 10 GB</p>
        </div>
        <button
          type="button"
          className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/80 transition-colors cursor-pointer"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          Select File
        </button>
      </div>
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFileInput} />
    </div>
  );
}

function DetailsStep({ form, onChange }: { form: FormData; onChange: (updates: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <label className="flex items-center gap-2 text-sm font-bold mb-2">
          <Film className="w-4 h-4 text-primary" />
          Title <span className="text-destructive">*</span>
        </label>
        <input
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={100}
          placeholder="Give your video a catchy title..."
          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{form.title.length}/100</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-bold mb-2">
          <AlignLeft className="w-4 h-4 text-primary" />
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          maxLength={5000}
          rows={5}
          placeholder="Tell viewers about your video..."
          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{form.description.length}/5000</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-bold mb-2">
          <Film className="w-4 h-4 text-primary" />
          Category <span className="text-destructive">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onChange({ category: cat })}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                form.category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary border border-border hover:bg-accent text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-bold mb-2">
          <Tag className="w-4 h-4 text-primary" />
          Tags
        </label>
        <input
          value={form.tags}
          onChange={(e) => onChange({ tags: e.target.value })}
          placeholder="gaming, tutorial, beginner (comma separated)"
          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
      </div>
    </div>
  );
}

const SUGGESTED_THUMBNAILS = [
  "https://images.unsplash.com/photo-1560419398-c36ab8c174b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
  "https://images.unsplash.com/photo-1672590311138-20daa4fcdfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
  "https://images.unsplash.com/photo-1716637644831-e046c73be197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
  "https://images.unsplash.com/photo-1630065612874-b0c19e95d30c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
  "https://images.unsplash.com/photo-1767969457898-51d5e9cf81d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
  "https://images.unsplash.com/photo-1545538331-78f76ca06830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
];

function ThumbnailStep({ form, onChange }: { form: FormData; onChange: (updates: Partial<FormData>) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    onChange({ thumbnailFile: file, thumbnailUrl: url });
    toast.success("Thumbnail uploaded!");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-muted-foreground mb-5">
        A great thumbnail stands out and attracts more viewers.
      </p>

      {form.thumbnailUrl && (
        <div className="mb-6">
          <p className="text-sm font-bold mb-2">Selected Thumbnail</p>
          <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border-2 border-primary">
            <img src={form.thumbnailUrl} alt="Selected thumbnail" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange({ thumbnailUrl: "", thumbnailFile: null })}
              className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary border border-border rounded-xl text-sm font-bold hover:bg-accent transition-colors cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-primary" />
          Upload custom thumbnail
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </div>

      <div>
        <p className="text-sm font-bold mb-3">Or pick a suggested thumbnail</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUGGESTED_THUMBNAILS.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => onChange({ thumbnailUrl: url, thumbnailFile: null })}
              className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:opacity-90 ${
                form.thumbnailUrl === url ? "border-primary scale-[1.03]" : "border-transparent"
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              {form.thumbnailUrl === url && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white drop-shadow" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublishStep({ form, onChange, videoFile }: { form: FormData; onChange: (updates: Partial<FormData>) => void; videoFile: File | null }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-secondary rounded-2xl p-4 flex gap-4">
        <div className="w-36 shrink-0 aspect-video rounded-lg overflow-hidden bg-card">
          {form.thumbnailUrl ? (
            <img src={form.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm line-clamp-2">{form.title || "Untitled video"}</p>
          <p className="text-xs text-muted-foreground mt-1">{form.category || "No category"}</p>
          {videoFile && (
            <p className="text-xs text-muted-foreground mt-1">
              {videoFile.name} - {(videoFile.size / 1024 / 1024).toFixed(1)} MB
            </p>
          )}
          {form.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {form.tags.split(",").slice(0, 4).map((t) => t.trim()).filter(Boolean).map((t) => (
                <span key={t} className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold mb-3">Visibility</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {([
            { val: "public", icon: Globe, label: "Public", desc: "Anyone can watch" },
            { val: "private", icon: Lock, label: "Private", desc: "Only you can watch" },
          ] as const).map(({ val, icon: Icon, label, desc }) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange({ visibility: val })}
              className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                form.visibility === val ? "border-primary bg-primary/10" : "border-border bg-secondary hover:bg-accent"
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${form.visibility === val ? "bg-primary/20" : "bg-card"}`}>
                <Icon className={`w-4 h-4 ${form.visibility === val ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              {form.visibility === val && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UploadingOverlay({ progress, title }: { progress: number; title: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-10 max-w-sm w-full mx-4 flex flex-col items-center gap-6 text-center shadow-2xl"
      >
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="oklch(0.25 0 0)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none" stroke="oklch(0.75 0.18 50)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {progress < 100 ? (
              <span className="text-sm font-bold tabular-nums">{Math.round(progress)}%</span>
            ) : (
              <CheckCircle2 className="w-8 h-8 text-primary" />
            )}
          </div>
        </div>
        <div>
          <p className="font-bold text-lg">{progress < 100 ? "Uploading..." : "Processing..."}</p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{title}</p>
        </div>
        <div className="w-full bg-secondary rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">
          {progress < 100 ? "Please don't close this tab" : "Almost ready..."}
        </p>
      </motion.div>
    </div>
  );
}

function SuccessScreen({ title, thumbnailUrl, videoId, onGoHome }: { title: string; thumbnailUrl: string; videoId: string; onGoHome: () => void }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center gap-6"
    >
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-black">Video Published!</h2>
        <p className="text-muted-foreground mt-1">Your video is now live on VidHub</p>
      </div>
      {thumbnailUrl && (
        <div className="w-48 aspect-video rounded-xl overflow-hidden border border-border shadow-lg">
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <p className="font-semibold max-w-xs line-clamp-2">{title}</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => navigate(`/watch/${videoId}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/80 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          Watch Now
        </button>
        <button
          onClick={onGoHome}
          className="px-5 py-2.5 bg-secondary border border-border rounded-full text-sm font-bold hover:bg-accent transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </motion.div>
  );
}

export default function UploadPage() {
  const navigate = useNavigate();
  const { addVideo } = useUploadedVideos();

  const [currentStep, setCurrentStep] = useState<Step>("Upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [published, setPublished] = useState(false);
  const [publishedId, setPublishedId] = useState("");

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    tags: "",
    visibility: "public",
    thumbnailUrl: "",
    thumbnailFile: null,
  });

  const updateForm = (updates: Partial<FormData>) =>
    setForm((f) => ({ ...f, ...updates }));

  const stepIndex = STEPS.indexOf(currentStep);

  const canProceed = () => {
    if (currentStep === "Upload") return videoFile !== null;
    if (currentStep === "Details") return form.title.trim().length > 0 && form.category !== "";
    return true;
  };

  const handleNext = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1] as Step);
  };

  const handleBack = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1] as Step);
  };

  const handlePublish = async () => {
    setUploading(true);
    setUploadProgress(0);

    await new Promise<void>((resolve) => {
      let p = 0;
      const tick = setInterval(() => {
        const increment = p < 60 ? 3 : p < 85 ? 1.5 : 0.5;
        p = Math.min(100, p + increment);
        setUploadProgress(p);
        if (p >= 100) {
          clearInterval(tick);
          setTimeout(resolve, 600);
        }
      }, 80);
    });

    const newId = `user-${Date.now()}`;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/\s+/g, ""))
      .filter(Boolean);

    addVideo({
      id: newId,
      title: form.title,
      channel: "Your Channel",
      channelAvatar: "YC",
      thumbnail:
        form.thumbnailUrl ||
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640&q=80",
      views: "0",
      duration: "0:00",
      uploadedAt: "Just now",
      category: form.category,
      description: form.description,
      tags,
      likes: 0,
      dislikes: 0,
    });

    setPublishedId(newId);
    setUploading(false);
    setPublished(true);
    toast.success("Video published successfully!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {uploading && <UploadingOverlay progress={uploadProgress} title={form.title} />}

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 py-8">
        {published ? (
          <SuccessScreen
            title={form.title}
            thumbnailUrl={form.thumbnailUrl}
            videoId={publishedId}
            onGoHome={() => navigate("/")}
          />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-black">Upload Video</h1>
                <p className="text-xs text-muted-foreground">Share your content with the world</p>
              </div>
            </div>

            <div className="flex items-center gap-0 mb-10">
              {STEPS.map((step, i) => {
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          done
                            ? "bg-primary text-primary-foreground"
                            : active
                            ? "bg-primary/20 border-2 border-primary text-primary"
                            : "bg-secondary border border-border text-muted-foreground"
                        }`}
                      >
                        {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1 font-semibold ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${i < stepIndex ? "bg-primary" : "bg-border"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === "Upload" && (
                  <UploadStep
                    onFileSelected={(file) => {
                      setVideoFile(file);
                      if (!form.title) {
                        const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
                        updateForm({ title: name });
                      }
                      handleNext();
                    }}
                  />
                )}
                {currentStep === "Details" && <DetailsStep form={form} onChange={updateForm} />}
                {currentStep === "Thumbnail" && <ThumbnailStep form={form} onChange={updateForm} />}
                {currentStep === "Publish" && <PublishStep form={form} onChange={updateForm} videoFile={videoFile} />}
              </motion.div>
            </AnimatePresence>

            {currentStep !== "Upload" && (
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-2.5 bg-secondary border border-border rounded-full text-sm font-bold hover:bg-accent transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                {currentStep !== "Publish" ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handlePublish}
                    disabled={!canProceed() || uploading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Publish Video
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
