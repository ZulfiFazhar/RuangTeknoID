// src/components/Header.jsx
import { Link } from "react-router-dom";
import { SquareTerminal, Search } from "lucide-react";
import { NavUser } from "@/components/navigation/NavUser";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { SearchHandling } from "./navigation/SearchHandling";
export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-background h-16 z-50 border-b">
      <div className="flex justify-between items-center h-full px-3">
        {/* kiri */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <SquareTerminal className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Ruang Teknologi</span>
            <span className="truncate font-semibold">Indonesia</span>
          </div>
        </Link>

        {/* tengah */}
        <div>
          <Button
            variant="outline"
            className="w-64 flex items-center gap-2 justify-between"
            onClick={() => setOpen(true)}
          >
            <div className="flex gap-2">
              <Search className="mt-[0.15em]" />
              Search
            </div>
            <kbd className="inline-flex items-center gap-1 px-1.5 font-semibold border rounded-sm bg-gray-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* kanan */}
        <NavUser />
      </div>
      <SearchHandling open={open} onOpenChange={setOpen} />
    </header>
  );
}
