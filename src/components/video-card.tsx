import { Link } from "react-router-dom";
import type { Video } from "@/lib/video-data.ts";

type VideoCardProps = {
  video: Video;
};

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/watch/${video.id}`} className="group block cursor-pointer">
      <div className="relative rounded-lg overflow-hidden aspect-video bg-secondary">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </div>

      <div className="flex gap-2 pt-2">
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold mt-0.5">
          {video.channelAvatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {video.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
          <p className="text-xs text-muted-foreground">
            {video.views} views &middot; {video.uploadedAt}
          </p>
        </div>
      </div>
    </Link>
  );
}
