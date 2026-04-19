import { useQuery } from "@tanstack/react-query";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";

export default function TopTracks({ time_range }: { time_range: string }) {
  const { data: value, isSuccess } = useQuery({
    queryKey: ["top_tracks", time_range],
    queryFn: async () => {
      const resultsReq = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/top-tracks/${time_range}`,
        {
          credentials: "include",
        },
      );
      const resultsResponse = await resultsReq.json();
      return resultsResponse.items;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <div className="my-2 md:my-0">
      <div className="grid md:grid-cols-5 grid-cols-3 gap-4 md:p-2">
        {isSuccess &&
          value.map((item: any) => (
            <Link key={item.id} to={`/song/${item.id}`}>
              <div className="grid place-items-center">
                <img
                  className=""
                  src={item.album.images[0].url}
                  alt={item.name}
                  loading="lazy"
                />
              </div>
              <div
                className="grid"
                style={{
                  justifyContent: "center",
                }}
              >
                <p className="text-center truncate font-bold">{item.name}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export function TopTracksPreview() {
  const { data, isSuccess, isPending } = useQuery({
    queryKey: ["top_tracks_short"],
    queryFn: async () => {
      const resultsReq = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/top-tracks/short_term`,
        {
          credentials: "include",
        },
      );
      const resultsRes = await resultsReq.json();
      return resultsRes.items;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <div className="p-4">
      <p className="font-bold text-2xl">Your Top Tracks This Month</p>
      <div className="flex gap-x-4 items-center">
        <div className="flex md:gap-6 gap-x-4 md:py-2 md:w-[90%] w-4/5 overflow-x-scroll">
          {isPending && <p>Still looking...</p>}

          {isSuccess &&
            data.map((item: any) => (
              <Link
                key={item.id}
                className="inline-block shrink-0"
                to={`/song/${item.id}`}
              >
                <div className="grid place-items-center">
                  <img
                    className="md:h-48 md:w-48 object-cover h-32 w-32"
                    src={item.album.images[0].url}
                    alt={item.name}
                  />
                </div>
                <div className="grid justify-center">
                  <p className="text-center truncate w-40 md:my-2 font-bold ">
                    {item.name}
                  </p>
                </div>
              </Link>
            ))}
        </div>

        <Link to="/top">
          <FiArrowRight className="inline w-8 h-8 rounded-full p-1 hover:bg-green-600 hover:text-white" />
        </Link>
      </div>
    </div>
  );
}

export function TopArtists({ range }: { range: string }) {
  const { data: artistsArray } = useQuery({
    queryKey: ["top_artists", range],
    queryFn: async () => {
      const resultsReq = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/top-artists/${range}`,
        {
          credentials: "include",
        },
      );
      return await resultsReq.json();
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <>
      <div className="grid md:grid-cols-5 grid-cols-3 gap-4">
        {artistsArray ? (
          <>
            {artistsArray.items.map((item: any) => (
              <div key={item.id}>
                <div className="place-items-center grid mt-3">
                  <img
                    className="md:h-48 sm:h-36 h-32 object-cover"
                    src={item.images[0].url}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>
                <p className="text-center font-bold">{item.name}</p>
              </div>
            ))}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export function TracksShort({ time_range }: { time_range: string }) {
  const { data, isSuccess } = useQuery({
    queryKey: ["top_tracks", time_range],
    queryFn: async () => {
      const resultsReq = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/top-tracks/${time_range}`,
        {
          credentials: "include",
        },
      );
      const resultsResponse = await resultsReq.json();
      return resultsResponse.items;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <div className="grid md:gap-x-4 p-2">
      <p className="text-xl font-bold underline">Your Top Tracks</p>
      {isSuccess &&
        data.slice(0, 7).map((item: any) => (
          <div key={item.id} className="flex items-center gap-4 my-2 ">
            <div className="grid place-items-center">
              <img
                className="h-12 w-12 md:w-18 md:h-18 object-cover"
                src={item.album.images[0].url}
                alt={item.name}
                loading="lazy"
              />
            </div>
            <div className="grid justify-center">
              <p className="truncate font-bold">{item.name}</p>
              <p className="flex gap-x-2">
                <span>{item.artists[0].name}</span>|{" "}
                <span className="hidden md:inline">{item.album.name}</span>
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
