import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Upload } from "lucide-react";
import Navbar from "@/components/navbar.tsx";
import VideoCard from "@/components/video-card.tsx";
import { VIDEOS, CATEGORIES } from "@/lib/video-data.ts";
import { useUploadedVideos } from "@/hooks/use-uploaded-videos.ts";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");

  const query = searchParams.get("q") ?? "";

  const { videos: uploadedVideos } = useUploadedVideos();
  const allVideos = useMemo(() => [...uploadedVideos, ...VIDEOS], [uploadedVideos]);

  const filtered = useMemo(() => {
    let list = allVideos;
    if (activeCategory !== "All") {
      list = list.filter((v) => v.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channel.toLowerCase().includes(q) ||
          v.tags.some((t) => t.includes(q))
      );
    }
    return list;
  }, [activeCategory, query, allVideos]);

  const handleSearch = (q: string) => {
    setSearchParams(q ? { q } : {});
    setActiveCategory("All");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onSearch={handleSearch} searchValue={query} />

      <div className="sticky top-14 z-40 bg-background border-b border-border">
        <div className="flex gap-2 px-4 md:px-6 py-3 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchParams({});
              }}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                activeCategory === cat && !query
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 md:px-6 py-6">
        {uploadedVideos.length === 0 && !query && activeCategory === "All" && (
          <Link
            to="/upload"
            className="flex items-center justify-between gap-4 bg-primary/10 border border-primary/30 rounded-2xl px-5 py-4 mb-6 hover:bg-primary/15 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Upload your first video</p>
                <p className="text-xs text-muted-foreground">
                  Share your content with the VidHub community
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-primary group-hover:underline shrink-0">
              Get started
            </span>
          </Link>
        )}

        {uploadedVideos.length > 0 && !query && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Your Uploads
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {uploadedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            <div className="border-t border-border mt-8 mb-6" />
          </div>
        )}

        {query && (
          <p className="text-muted-foreground text-sm mb-4">
            Search results for{" "}
            <span className="text-foreground font-semibold">"{query}"</span> -{" "}
            {filtered.length} video{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-2xl font-bold mb-2">No videos found</p>
            <p className="text-muted-foreground">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} VidHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
