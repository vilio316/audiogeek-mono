import { useState } from "react";
import TopTracks, { TopArtists, TopItemsImage } from "./TopItems";
import { FiX } from "react-icons/fi";

export default function TopItemsPage() {
  const [topCategory, updateTopCategory] = useState<"tracks" | "artists">(
    "tracks",
  );
  const [timeRange, changeRange] = useState("short_term");
  const [imagePreview, changePreviewState] = useState(false);

  return (
    <div className="p-3 md:p-6 grid relative">
      <div>
        <p className="font-bold text-3xl">Your Top Items</p>
        <div className="items-center w-full grid grid-cols-4">
          <div className="gap-x-4 flex p-2 col-span-3">
            <button onClick={() => updateTopCategory("tracks")}>Tracks</button>
            <button onClick={() => updateTopCategory("artists")}>
              Artists
            </button>
          </div>

          <span
            className="col-span-1 text-right"
            onClick={() => changePreviewState(true)}
          >
            Generate Top Items Image
          </span>
        </div>

        <div className="flex gap-x-4 items-center">
          <label>Select Time Range: </label>
          <select onChange={(e) => changeRange(e.target.value)}>
            <option value={"short_term"}>Last 4 Weeks</option>
            <option value={"medium_term"}>Last 6 Months</option>
            <option value={"long_term"}> &gt; 1 Year</option>
          </select>
        </div>
        <div>
          {topCategory === "tracks" ? (
            <TopTracks time_range={timeRange} />
          ) : (
            <TopArtists range={timeRange} />
          )}
        </div>
      </div>

      {imagePreview && (
        <div className="absolute z-20 top-0 w-screen min-h-screen imageModal md:p-6 bg-linear-150 from-purple-900/90 to-gray-500">
          <span className="w-full justify-end flex">
            <FiX
              className="h-6 w-6"
              onClick={() => changePreviewState(false)}
            />
          </span>
          <TopItemsImage timeframe={timeRange} />
        </div>
      )}
    </div>
  );
}

/*className="p-2 bg-linear-180 from-purple-900 to-zinc-800 " */
