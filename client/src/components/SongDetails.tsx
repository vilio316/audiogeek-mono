import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { FaSpotify } from "react-icons/fa6";

export const makeTimeString = (ms_value: number) => {
  let second_val = Math.ceil(Number(ms_value / 1000));
  let minutes = Math.floor(second_val / 60);
  let seconds = second_val - minutes * 60;
  let secondString = "";
  if (seconds < 10) {
    secondString = "0" + String(seconds);
  } else {
    secondString = String(seconds);
  }
  return `${minutes}:${secondString}`;
};

export default function SongDetails() {
  const params = useParams();

  const { data, isSuccess } = useQuery({
    queryKey: ["song_details", params.id],
    queryFn: async () => {
      const songRequest = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/track/${params.id}`,
        {
          credentials: "include",
        },
      );
      const songResponse = await songRequest.json();
      return songResponse;
    },
    staleTime: 2 * 60 * 60 * 1000,
  });
  return (
    <>
      {isSuccess && (
        <>
          <div className="wrapper p-4">
            <span style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              {data.name}
            </span>
            <p>
              <span className="text-xl">Artist(s)</span>:{" "}
              <span style={{ fontSize: "1.5rem" }}>
                {data.artists.length > 1 ? (
                  data.artists.map((artiste: any) => (
                    <span key={artiste.id}>
                      <a
                        style={{ textDecoration: "none" }}
                        href={`/artists/${artiste.id}`}
                      >
                        {artiste.name} -{" "}
                      </a>
                    </span>
                  ))
                ) : (
                  <span>
                    <a
                      style={{ textDecoration: "none" }}
                      href={`/artists/${data.artists[0].id}`}
                    >
                      {data.artists[0].name}
                    </a>
                  </span>
                )}
              </span>
            </p>
            <div id="song_card" className="grid grid-cols-4">
              <div className="place-items-center p-2 col-span-1">
                <img
                  src={data.album.images[1].url}
                  alt={`${data.name}`}
                  className="block w-[90%] border border-black"
                />
              </div>
              <div className="items-center grid content-center">
                <p className="text-lg my-3">
                  Album :{" "}
                  <Link
                    to={`/albums/${data.album.id}`}
                    className="font-bold underline"
                  >
                    {data.album.name}
                  </Link>
                </p>
                <p className="text-lg my-3">
                  Release Date: {data.album.release_date}
                </p>
                <p className="text-lg my-3">
                  {" "}
                  Duration : {makeTimeString(data.duration_ms)}
                </p>
                {data.popularity > 0 && (
                  <p className="text-lg my-3">
                    {" "}
                    Popularity Score: {data.popularity}
                  </p>
                )}
                <div className="flex gap-x-4">
                  <FaSpotify className="w-8 h-8 fill-green-600" />
                  <p className="underline text-xl">
                    <a href={data.external_urls.spotify}>Listen on Spotify</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
