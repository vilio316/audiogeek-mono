import { useState } from "react";
import TopTracks, { TopArtists } from "./TopItems";
import { TopItemsImage } from "./TopItemsImage";
import { FiX } from "react-icons/fi";
import { useSearchParams } from "react-router";

export default function TopItemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const range = searchParams.get("range")
    ? searchParams.get("range")
    : "short_term";
  const itemClass = searchParams.get("item_class")
    ? searchParams.get("item_class")
    : "tracks";

  const [imagePreview, changePreviewState] = useState(false);

  return (
    <div className="p-2 md:p-4 grid relative">
      <div>
        <p className="font-bold md:text-3xl text-2xl">Your Top Items</p>
        <div className="items-center w-full grid md:grid-cols-4">
          <div className="gap-x-4 flex p-2 md:col-span-3">
            <button
              onClick={() =>
                setSearchParams(`?range=${range}&item_class=tracks`)
              }
            >
              Tracks
            </button>
            <button
              onClick={() =>
                setSearchParams(`range=${range}&item_class=artists`)
              }
            >
              Artists
            </button>
          </div>

          <span
            className="col-span-1 text-center w-3/5 bg-green-500 justify-self-end text-white md:p-2 p-1 rounded-xl"
            onClick={() => changePreviewState(true)}
          >
            Generate Image
          </span>
        </div>

        <div className="flex gap-x-4 items-center my-2 md:my-1 ">
          <label>Select Time Range: </label>
          <select
            className="border border-black"
            onChange={(e) =>
              setSearchParams(
                `?range=${e.target.value}&item_class=${itemClass}`,
              )
            }
            defaultValue={String(range)}
          >
            <option value={"short_term"}>Last 4 Weeks</option>
            <option value={"medium_term"}>Last 6 Months</option>
            <option value={"long_term"}> &gt; 1 Year</option>
          </select>
        </div>
        <div>
          {searchParams.get("item_class") !== "artists" ? (
            <TopTracks time_range={range ? String(range) : "short_term"} />
          ) : (
            <TopArtists range={range ? String(range) : "short_term"} />
          )}
        </div>
      </div>

      {imagePreview && (
        <div className="absolute z-20 -top-16 w-screen min-h-screen imageModal md:p-4 p-1 bg-linear-150 from-purple-900/90 to-gray-500">
          <span className="w-full justify-end flex">
            <FiX
              className="h-6 w-6"
              onClick={() => changePreviewState(false)}
            />
          </span>
          <TopItemsImage
            timeframe={searchParams ? String(range) : "short_term"}
          />
        </div>
      )}
    </div>
  );
}
