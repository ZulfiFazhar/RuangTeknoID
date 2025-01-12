import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/api/api";

export default function SearchResult() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchKeyword = params.get("keyword");

  const [data, setData] = useState(null); // State untuk menyimpan data dari API
  const [loading, setLoading] = useState(true); // State untuk menunjukkan status loading
  const [error, setError] = useState(null); // State untuk menangani error

  useEffect(() => {
    // Mengambil data dari API
    const fetchData = async () => {
      try {
        const response = await api.get("/post/search?keyword=" + searchKeyword);
        setData(response.data); // Menyimpan data hasil API ke state
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("An error occurred while fetching data."); // Menangani error
      } finally {
        setLoading(false); // Menandakan bahwa loading sudah selesai
      }
    };

    fetchData();
  }, [searchKeyword]); // Dependensi untuk menjalankan ulang jika keyword berubah

  if (loading) {
    return <div>Loading...</div>;
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
      {/* Menampilkan data dalam format JSON */}
    </div>
  );
}
