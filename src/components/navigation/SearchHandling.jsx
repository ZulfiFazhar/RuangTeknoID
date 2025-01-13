import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import PropTypes from "prop-types";
import { AuthContext } from "@/components/auth/auth-context";

export function SearchHandling({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const { authStatus } = useContext(AuthContext);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && query.trim() !== "") {
      const modifiedQuery = query.replace(/ /g, "+");

      navigate(`/search?keyword=${modifiedQuery}`);

      onOpenChange(false);
      if (!authStatus.authStatus) {
        return;
      }
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await api.post(
          "/activity/log",
          { searchQuery: query },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "x-refresh-token": refreshToken,
            },
          }
        );
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getSearchHistory = async () => {
    if (!authStatus.authStatus) {
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await api.get("/activity/logs/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      });
      setSearchHistory(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSearchHistory();
  }, [authStatus]);

  const handleItemClick = (searchQuery) => {
    console.log("Item clicked:", searchQuery);
    if (searchQuery.trim() !== "") {
      const modifiedQuery = searchQuery.replace(/ /g, "+");
      navigate(`/search?keyword=${modifiedQuery}`);
      onOpenChange(false);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 border-none"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <CommandList>
        <CommandGroup heading="Riwayat pencarian">
          {searchHistory.length > 0 ? (
            searchHistory.map((item, index) => (
              <CommandItem key={index}>
                <Search className="mr-2 h-1 w-1 shrink-0 opacity-50" />
                <button
                  onClick={() => handleItemClick(item.searchQuery)}
                  className="w-full h-full text-left"
                >
                  {item.searchQuery}
                </button>
              </CommandItem>
            ))
          ) : (
            <p className="p-3 text-sm text-muted-foreground">
              Tidak ada riwayat pencarian.
            </p>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

SearchHandling.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};
