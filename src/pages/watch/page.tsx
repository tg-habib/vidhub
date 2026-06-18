import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MoreHorizontal,
  Bell,
  BellOff,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Check,
  Flag,
  ListPlus,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/navbar.tsx";
import VideoPlayer from "./_components/video-player.tsx";
import CommentsSection from "./_components/comments-section.tsx";
import { VIDEOS } from "@/lib/video-data.ts";
import { getCommentsForVideo } from "@/lib/comment-data.ts";

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const video = VIDEOS.find((v) => v.id === id);

  const [showDesc, setShowDesc] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [notified, setNotified] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    setShowDesc(false);
    setLiked(false);
    setDisliked(false);
    setSaved(false);
    setCopied(false);
    setShowMoreMenu(false);
  }, [id]);

  useEffect(() => {
    if (!showMoreMenu) return;
    const close = () => setShowMoreMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showMoreMenu]);

  const comments = getCommentsForVideo(id ?? "");
  const related = VIDEOS.filter((v) => v.id !== id);

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-2xl font-bold">Video not found</p>
            <p className="text-muted-foreground text-sm">
              The video you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold cursor-pointer hover:bg-primary/80 transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatCount = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M`
      : n >= 1000
      ? `${(n / 1000).toFixed(1)}K`
      : String(n);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSave = () => {
    setSaved((s) => !s);
    toast.success(saved ? "Removed from saved videos" : "Saved to your library");
  };

  const handleSubscribe = () => {
    const next = !subscribed;
    setSubscribed(next);
    if (!next) setNotified(false);
    toast.success(next ? `Subscribed to ${video.channel}` : `Unsubscribed from ${video.channel}`);
  };

  const handleNotify = () => {
    const next = !notified;
    setNotified(next);
    toast.success(next ? "You'll be notified of new uploads" : "Notifications turned off");
  };

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    if (next) setDisliked(false);
  };

  const handleDislike = () => {
    const next = !disliked;
    setDisliked(next);
    if (next) setLiked(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row gap-6 px-4 md:px-6 py-5 max-w-[1600px] mx-auto w-full">
        <div className="flex-1 min-w-0">
          <VideoPlayer
            key={id}
            thumbnail={video.thumbnail}
            title={video.title}
            duration={video.duration}
          />

          <h1 className="text-base md:text-xl font-bold mt-4 leading-snug">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-start justify-between gap-3 mt-3 pb-4 border-b border-border">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0 cursor-pointer">
                {video.channelAvatar}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-sm">{video.channel}</p>
                  <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">1.2M subscribers</p>
              </div>

              <button
                onClick={handleSubscribe}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  subscribed
                    ? "bg-secondary text-foreground hover:bg-accent border border-border"
                    : "bg-foreground text-background hover:opacity-80"
                }`}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>

              {subscribed && (
                <button
                  onClick={handleNotify}
                  className={`p-2 rounded-full transition-colors cursor-pointer border border-border ${
                    notified
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary hover:bg-accent"
                  }`}
                  title={notified ? "Turn off notifications" : "Turn on notifications"}
                >
                  {notified ? (
                    <Bell className="w-4 h-4 fill-current" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-secondary rounded-full overflow-hidden border border-border">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold transition-colors cursor-pointer border-r border-border ${
                    liked ? "text-primary bg-primary/10" : "hover:bg-accent"
                  }`}
                  title="Like"
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? "fill-primary" : ""}`} />
                  {formatCount(video.likes + (liked ? 1 : 0))}
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold transition-colors cursor-pointer ${
                    disliked ? "text-destructive bg-destructive/10" : "hover:bg-accent"
                  }`}
                  title="Dislike"
                >
                  <ThumbsDown className={`w-4 h-4 ${disliked ? "fill-destructive" : ""}`} />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-secondary hover:bg-accent border border-border px-3.5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer"
                title="Share"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 border border-border px-3.5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                  saved
                    ? "bg-primary/10 text-primary border-primary"
                    : "bg-secondary hover:bg-accent"
                }`}
                title="Save to library"
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-primary" : ""}`} />
                <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
              </button>

              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowMoreMenu((m) => !m)}
                  className="p-2 bg-secondary hover:bg-accent border border-border rounded-full transition-colors cursor-pointer"
                  title="More options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-10 bg-card border border-border rounded-xl shadow-2xl z-30 min-w-[180px] overflow-hidden py-1">
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors cursor-pointer"
                      onClick={() => { handleSave(); setShowMoreMenu(false); }}
                    >
                      <ListPlus className="w-4 h-4" />
                      Add to playlist
                    </button>
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors cursor-pointer"
                      onClick={() => { handleShare(); setShowMoreMenu(false); }}
                    >
                      <Copy className="w-4 h-4" />
                      Copy link
                    </button>
                    <div className="border-t border-border my-1" />
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors cursor-pointer"
                      onClick={() => { toast("Report submitted. Thank you for your feedback."); setShowMoreMenu(false); }}
                    >
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="mt-3 bg-secondary/60 hover:bg-secondary rounded-xl p-4 text-sm cursor-pointer transition-colors"
            onClick={() => setShowDesc((s) => !s)}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1.5 flex-wrap">
              <span>{video.views} views</span>
              <span className="text-muted-foreground font-normal">{video.uploadedAt}</span>
              {video.tags.map((t) => (
                <span
                  key={t}
                  className="text-primary cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); navigate(`/?q=${encodeURIComponent(t)}`); }}
                >
                  #{t}
                </span>
              ))}
            </div>
            <p className={`text-foreground/85 leading-relaxed ${showDesc ? "" : "line-clamp-2"}`}>
              {video.description}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm font-bold text-foreground pointer-events-none">
              {showDesc ? (
                <><ChevronUp className="w-4 h-4" /> Show less</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> Show more</>
              )}
            </div>
          </div>

          <CommentsSection key={id} videoId={video.id} comments={comments} />
        </div>

        <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Up Next
          </h2>
          <div className="flex flex-col gap-1">
            {related.map((v) => (
              <Link
                key={v.id}
                to={`/watch/${v.id}`}
                className="flex gap-2.5 group cursor-pointer rounded-xl hover:bg-secondary p-2 transition-colors"
              >
                <div className="relative w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-secondary">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/85 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {v.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-xs font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {v.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {v.channel}
                    <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {v.views} views &middot; {v.uploadedAt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
