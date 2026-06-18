import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

type VideoPlayerProps = {
  thumbnail: string;
  title: string;
  duration: string;
};

function parseDuration(dur: string): number {
  const parts = dur.split(":").map(Number);
  if (parts.length === 2) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
}

function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoPlayer({
  thumbnail,
  title,
  duration,
}: VideoPlayerProps) {
  const total = parseDuration(duration);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(30);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState("1080p");
  const [showQuality, setShowQuality] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          const next = t + 0.5;
          if (next >= total) {
            setPlaying(false);
            return 0;
          }
          setProgress((next / total) * 100);
          setBuffered((b) => Math.min(100, Math.max(b, (next / total) * 100 + 8)));
          return next;
        });
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, total]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) {
      hideTimerRef.current = setTimeout(() => {
        if (!isDragging.current) setShowControls(false);
      }, 3000);
    }
  }, [playing]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [playing, resetHideTimer]);

  useEffect(() => {
    const onFsChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipBy(10);
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBy(-10);
          break;
        case "m":
        case "M":
          setMuted((m) => !m);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => setPlaying((p) => !p);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const skipBy = (secs: number) => {
    setCurrentTime((t) => {
      const next = Math.max(0, Math.min(total, t + secs));
      setProgress((next / total) * 100);
      return next;
    });
  };

  const applySeek = useCallback(
    (clientX: number) => {
      const bar = seekBarRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = pct * total;
      setCurrentTime(newTime);
      setProgress(pct * 100);
    },
    [total]
  );

  const onSeekMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.current = true;
    applySeek(e.clientX);

    const onMove = (ev: MouseEvent) => applySeek(ev.clientX);
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onSeekTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) applySeek(touch.clientX);
  };
  const onSeekTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) applySeek(touch.clientX);
  };

  const qualities = ["4K", "1080p", "720p", "480p", "360p"];

  useEffect(() => {
    if (!showQuality) return;
    const close = () => setShowQuality(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showQuality]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden select-none outline-none"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (playing && !isDragging.current) setShowControls(false);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) togglePlay();
      }}
    >
      <img
        src={thumbnail}
        alt={title}
        className={`w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${playing ? "opacity-40" : "opacity-75"}`}
      />

      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        >
          <div
            className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          >
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      />

      <div
        className={`absolute top-0 left-0 right-0 px-4 pt-3 pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-white text-sm font-semibold line-clamp-1 drop-shadow-md">
          {title}
        </p>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 px-3 pb-2 pt-6 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={seekBarRef}
          className="relative h-5 flex items-center cursor-pointer mb-1 group/seek"
          onMouseDown={onSeekMouseDown}
          onTouchStart={onSeekTouchStart}
          onTouchMove={onSeekTouchMove}
        >
          <div className="absolute left-0 right-0 h-1 group-hover/seek:h-1.5 transition-all duration-150 rounded-full bg-white/25">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-white/40"
              style={{ width: `${buffered}%` }}
            />
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-0.5">
            <button
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              onClick={togglePlay}
            >
              {playing ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white" />
              )}
            </button>

            <button
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white text-xs font-bold flex items-center gap-0.5"
              onClick={() => skipBy(-10)}
              title="Rewind 10s"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <text x="12" y="16" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">10</text>
              </svg>
            </button>

            <button
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white text-xs font-bold"
              onClick={() => skipBy(10)}
              title="Forward 10s"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <text x="12" y="16" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">10</text>
              </svg>
            </button>

            <div
              className="flex items-center gap-1"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                onClick={() => setMuted((m) => !m)}
                title="Mute (M)"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${showVolume ? "w-20" : "w-0"}`}
              >
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setMuted(false);
                  }}
                  className="w-20 accent-primary cursor-pointer"
                />
              </div>
            </div>

            <span className="text-white text-xs font-mono tabular-nums ml-1 hidden sm:block">
              {formatTime(currentTime)} / {formatTime(total)}
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                onClick={() => setShowQuality((s) => !s)}
                title="Quality settings"
              >
                <Settings className="w-4 h-4 text-white" />
                <span className="text-white text-xs hidden sm:block font-semibold">
                  {quality}
                </span>
              </button>
              {showQuality && (
                <div className="absolute bottom-10 right-0 bg-[#1c1c1c] border border-border rounded-xl overflow-hidden shadow-2xl z-20 min-w-[100px]">
                  <p className="text-xs text-muted-foreground px-3 py-2 border-b border-border font-semibold">
                    Quality
                  </p>
                  {qualities.map((q) => (
                    <button
                      key={q}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors cursor-pointer ${quality === q ? "text-primary font-bold" : "text-foreground"}`}
                      onClick={() => { setQuality(q); setShowQuality(false); toast.success(`Quality set to ${q}`); }}
                    >
                      {q}
                      {quality === q && <span className="float-right text-primary">checkmark</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center"
              title="Keyboard shortcuts"
              onClick={() => toast("Shortcuts: Space=Play/Pause  Left/Right=+-10s  M=Mute  F=Fullscreen", { duration: 3000 })}
            >
              <span className="text-white text-xs font-bold opacity-70">K</span>
            </button>

            <button
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              onClick={toggleFullscreen}
              title="Fullscreen (F)"
            >
              {fullscreen ? (
                <Minimize className="w-4 h-4 text-white" />
              ) : (
                <Maximize className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
