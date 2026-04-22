import { useQuery } from "@tanstack/react-query";
import { makeTimeString } from "./SongDetails";
import { FaPause, FaPlay } from "react-icons/fa6";

export function NowPlaying() {
  const { data, error, isSuccess } = useQuery({
    queryKey: ["currently-playing"],
    queryFn: async () => {
      const currentlyPlayingRequest = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/currently-playing`,
        {
          credentials: "include",
        },
      );
      const currentlyPlayingResponse = await currentlyPlayingRequest.json();
      return currentlyPlayingResponse;
    },
    staleTime: 1000,
    refetchInterval: 1000,
  });

  function makeTimetoSeconds(time_val: number) {
    let seconds = time_val / 1000;
    return seconds;
  }
  return (
    <>
      {isSuccess ? (
        <>
          <h3 className="underline my-2 indent-2">Now Playing: </h3>
          <div
            id="np_wrapper"
            className="md:grid grid-cols-2 gap-x-4 md:w-3/5 p-2 md:p-1"
          >
            <div className="grid col-span-1" id="player">
              <SongFromSearch object={data.item} />
            </div>

            <div
              id="playback_monitor_container"
              className="grid col-span-1 text-sm md:text-lg"
            >
              <div className="flex gap-x-4 w-[95%] items-end justify-items-center">
                <button>
                  {!data.is_playing ? (
                    <FaPlay className="w-10 h-10" />
                  ) : (
                    <FaPause className="w-10 h-10" />
                  )}
                </button>
                <span className="grid">
                  {makeTimeString(data.progress_ms)} /{" "}
                  {makeTimeString(data.item.duration_ms)}{" "}
                </span>
                <PlayState />
              </div>
              <div className="grid">
                <input
                  type="range"
                  id="play_monitor"
                  max={makeTimetoSeconds(data.item.duration_ms)}
                  min={0}
                  value={makeTimetoSeconds(data.progress_ms)}
                  readOnly
                  className="text-green-500 w-[90%] grid jsutify-self-center my-2"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>{error && <p>Error retrieving "Now Playing" state. </p>}</>
      )}
    </>
  );
}

function PlayState() {
  const { data, isSuccess } = useQuery({
    queryKey: ["player_state"],
    queryFn: async () => {
      const currentlyPlayingRequest = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/player`,
        {
          credentials: "include",
        },
      );
      const currentlyPlayingResponse = await currentlyPlayingRequest.json();
      return currentlyPlayingResponse;
    },
    staleTime: 1000,
    refetchInterval: 1000,
  });

  return (
    <>
      {isSuccess ? (
        <>
          <span
            style={{
              display: "grid",
              textAlign: "right",
            }}
          >
            Listening on <b>{data.device.name}</b>
          </span>
        </>
      ) : (
        <>
          <p>Error retrieving Player state</p>
        </>
      )}
    </>
  );
}

export function SongFromSearch(props: any) {
  let object = props.object;

  return (
    <>
      <div id="search_comp" className="flex gap-x-4 items-center py-2 px-1">
        <div>
          <img
            className="w-24 h-24 object-cover"
            src={object.album.images[1].url}
            alt={object.name}
          ></img>
        </div>
        <div key={object.id} className="p-1 col-span-3">
          <p id="song_title" className="text-xl">
            <a href={`/song/${object.id}`}>{object.name} </a>
          </p>
          <p id="artistName" className="text-sm">
            <a href={`/artists/${object.artists[0].id}`}>
              {object.artists[0].name}
            </a>
          </p>
        </div>
        {/* <p>{makeTimeString(object.duration_ms)}</p> */}
      </div>
    </>
  );
}
