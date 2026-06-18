import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User, X, Menu, Upload } from "lucide-react";

type NavbarProps = {
  onSearch?: (q: string) => void;
  searchValue?: string;
};

export default function Navbar({ onSearch, searchValue = "" }: NavbarProps) {
  const [query, setQuery] = useState(searchValue);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (mobileSearchOpen) mobileInputRef.current?.focus();
  }, [mobileSearchOpen]);

  const submitSearch = (q: string) => {
    const trimmed = q.trim();
    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
    }
    setMobileSearchOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    submitSearch("");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-border flex items-center px-4 md:px-6 h-14 gap-3">
        <Link to="/" className="flex items-center gap-1.5 shrink-0 mr-2">
          <div className="bg-primary rounded-md px-2 py-0.5">
            <span className="text-primary-foreground font-black text-lg tracking-tight">
              VidHub
            </span>
          </div>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="hidden md:flex flex-1 max-w-2xl items-center bg-secondary rounded-full border border-border overflow-hidden focus-within:border-primary transition-colors"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos, channels, topics..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 hover:bg-accent transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-secondary hover:bg-accent border-l border-border transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
        </form>

        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-1">
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-full cursor-pointer transition-colors"
            onClick={() => setMobileSearchOpen((o) => !o)}
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to="/upload"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-accent border border-border rounded-full text-sm font-bold transition-colors cursor-pointer"
            title="Upload video"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Link>

          <button
            className="hidden md:flex p-2 hover:bg-secondary rounded-full cursor-pointer transition-colors"
            title="Notifications"
            onClick={() => {}}
          >
            <Bell className="w-5 h-5" />
          </button>

          <button className="p-1 hover:bg-secondary rounded-full cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </button>

          <button
            className="md:hidden p-2 hover:bg-secondary rounded-full cursor-pointer transition-colors"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {mobileSearchOpen && (
        <div className="md:hidden sticky top-14 z-40 bg-[#1a1a1a] border-b border-border px-4 py-2">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-secondary rounded-full border border-border overflow-hidden focus-within:border-primary transition-colors"
          >
            <input
              ref={mobileInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              onKeyDown={(e) => e.key === "Escape" && setMobileSearchOpen(false)}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-2 hover:bg-accent transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 border-l border-border hover:bg-accent transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
