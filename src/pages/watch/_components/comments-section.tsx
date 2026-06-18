import { useState, useRef, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Pin, ChevronDown, ChevronUp, CornerDownRight } from "lucide-react";
import type { Comment } from "@/lib/comment-data.ts";

type CommentItemProps = {
  comment: Comment;
  isReply?: boolean;
  onReplyPosted?: (parentId: string, reply: Comment) => void;
};

function CommentItem({ comment, isReply = false, onReplyPosted }: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState<Comment[]>(comment.replies ?? []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replying) inputRef.current?.focus();
  }, [replying]);

  const formatLikes = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  const handlePostReply = () => {
    if (!replyText.trim()) return;
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      videoId: comment.videoId,
      author: "You",
      avatar: "YO",
      text: replyText.trim(),
      likes: 0,
      timeAgo: "Just now",
      replies: [],
    };
    setLocalReplies((prev) => [...prev, newReply]);
    onReplyPosted?.(comment.id, newReply);
    setReplyText("");
    setReplying(false);
    setShowReplies(true);
  };

  const totalReplies = localReplies.length;

  return (
    <div className={`flex gap-3 ${isReply ? "ml-10 mt-3" : ""}`}>
      <div
        className={`shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold ${
          isReply ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm"
        }`}
      >
        {comment.avatar}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-bold">{comment.author}</span>
          {comment.pinned && !isReply && (
            <span className="flex items-center gap-0.5 text-xs text-primary font-semibold">
              <Pin className="w-3 h-3" /> Pinned by channel
            </span>
          )}
          <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {comment.text}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => { setLiked((l) => !l); if (!liked) setDisliked(false); }}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
              liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-primary" : ""}`} />
            {formatLikes(comment.likes + (liked ? 1 : 0))}
          </button>

          <button
            onClick={() => { setDisliked((d) => !d); if (!disliked) setLiked(false); }}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
              disliked ? "text-destructive" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ThumbsDown className={`w-3.5 h-3.5 ${disliked ? "fill-destructive" : ""}`} />
          </button>

          {!isReply && (
            <button
              onClick={() => setReplying((r) => !r)}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
            >
              Reply
            </button>
          )}
        </div>

        {replying && (
          <div className="flex gap-2 mt-3">
            <div className="shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              YO
            </div>
            <div className="flex-1">
              <input
                ref={inputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author}...`}
                className="w-full bg-transparent border-b border-border pb-1 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePostReply();
                  if (e.key === "Escape") { setReplying(false); setReplyText(""); }
                }}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => { setReplying(false); setReplyText(""); }}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostReply}
                  disabled={!replyText.trim()}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {totalReplies > 0 && !isReply && (
          <button
            onClick={() => setShowReplies((s) => !s)}
            className="flex items-center gap-1 mt-2 text-sm text-primary font-bold hover:text-primary/80 transition-colors cursor-pointer"
          >
            <CornerDownRight className="w-3.5 h-3.5" />
            {showReplies
              ? `Hide ${totalReplies} repl${totalReplies === 1 ? "y" : "ies"}`
              : `${totalReplies} repl${totalReplies === 1 ? "y" : "ies"}`}
            {showReplies ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {showReplies && (
          <div className="flex flex-col">
            {localReplies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type CommentsSectionProps = {
  videoId: string;
  comments: Comment[];
};

type SortType = "top" | "newest";

export default function CommentsSection({
  videoId,
  comments,
}: CommentsSectionProps) {
  const [sort, setSort] = useState<SortType>("top");
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalComments(comments);
    setSort("top");
    setNewComment("");
    setFocused(false);
  }, [videoId, comments]);

  const sorted = [...localComments].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sort === "top") return b.likes - a.likes;
    return 0;
  });

  const handlePost = () => {
    if (!newComment.trim()) return;
    const c: Comment = {
      id: `user-${Date.now()}`,
      videoId,
      author: "You",
      avatar: "YO",
      text: newComment.trim(),
      likes: 0,
      timeAgo: "Just now",
      replies: [],
    };
    setLocalComments((prev) => [c, ...prev]);
    setNewComment("");
    setFocused(false);
    setSort("newest");
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h2 className="text-base font-bold">
          {localComments.length.toLocaleString()} Comments
        </h2>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-sm text-muted-foreground mr-1">Sort by</span>
          {(["top", "newest"] as SortType[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                sort === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-accent text-foreground"
              }`}
            >
              {s === "top" ? "Top" : "Newest first"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-7">
        <div className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
          YO
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-border pb-1 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePost();
              if (e.key === "Escape") { setFocused(false); setNewComment(""); inputRef.current?.blur(); }
            }}
          />
          {focused && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => { setFocused(false); setNewComment(""); inputRef.current?.blur(); }}
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!newComment.trim()}
                className="px-4 py-1.5 rounded-full text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {sorted.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
