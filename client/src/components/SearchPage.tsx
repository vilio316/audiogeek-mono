import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { SongFromSearch } from "./NowPlaying";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const baseURL = import.meta.env.VITE_SERVER_URL;

  const {
    data: searchResults,
    isSuccess,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      const searchRequest = await fetch(
        `${baseURL}/apii/search/${searchQuery}`,
        {
          credentials: "include",
        },
      );
      const searchResponse = await searchRequest.json();
      return searchResponse;
    },
    staleTime: 1 * 24 * 60 * 1000,
  });

  return (
    <div className="p-1 md:p-2 mx-auto">
      <p className="text-xl font-bold">Search</p>
      <input
        type="text"
        autoFocus
        className="rounded-4xl outline-0 indent-4 p-2 text-2xl border-green-500 border-2 my-1 md:my-2 w-4/5"
        placeholder="Search for a song, album or artist..."
        onChange={(e) => setSearchParams([["q", String(e.target.value)]])}
      />
      {isSuccess && (
        <div>
          {searchResults.tracks.items.map((track: any) => (
            <SongFromSearch object={track} />
          ))}
        </div>
      )}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
