import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/api/api";
import LoadingPage from "@/components/ui/loading-page";

export default function SearchResult() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchKeyword = params.get("keyword");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/post/search?keyword=" + searchKeyword);
        setData(response.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Keyword tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchKeyword]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-xl font-bold text-zinc-400">
        Result for <span className="text-black">{searchKeyword}</span>
      </h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>{" "}
    </div>
  );
}
