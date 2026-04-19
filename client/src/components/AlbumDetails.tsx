import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export default function AlbumDetails() {
  const params = useParams();

  const { data, isSuccess } = useQuery({
    queryKey: ["album_details", params.id],
    queryFn: async () => {
      const albumReq = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/album/${params.id}`,
        {
          credentials: "include",
        },
      );
      const albumRes = await albumReq.json();
      return albumRes;
    },
    staleTime: 2 * 60 * 60 * 1000,
  });

  return (
    <>
      {isSuccess && (
        <>
          <div id="song_card" className="flex shrink-0 p-2 gap-x-3 md:gap-x-5 ">
            <div style={{ display: "grid", placeItems: "center" }}>
              <img
                src={data.images[1].url}
                style={{ width: "75%" }}
                alt={`${data.name} Album Cover Art`}
              />
            </div>
            <div style={{ alignSelf: "center" }}>
              <p className="font-bold text-xl md:my-2 my-1">{data.name}</p>
              <p>
                Artist(s):
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
                      {" "}
                      {data.artists[0].name}
                    </a>
                  </span>
                )}
              </p>
              <p>Songs: {data.tracks.items.length}</p>
              <p>Release Date: {data.release_date}</p>
            </div>
          </div>
          <div className="md:p-8 p-3 grid justify-self-center w-full mx-auto my-2">
            {data.tracks.items.map((track: any) => (
              <div
                className="side_number flex gap-x-4 items-center"
                key={track.id}
              >
                <p className="font-bold text-right">
                  {data.tracks.items.indexOf(track) + 1}.
                </p>
                <SongInAlbum object={track} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export function SongInAlbum(props: any) {
  let object = props.object;

  return (
    <div
      className="album_song"
      style={{ display: "grid", alignContent: "center", alignItems: "center" }}
      key={object.id}
    >
      <div>
        <a style={{ fontSize: "1.25rem" }} href={`/song/${object.id}`}>
          {object.name}
        </a>
        <p>
          {object.artists.length > 1 ? (
            object.artists.map((artiste: any) => (
              <span style={{ fontSize: "0.75rem" }} key={artiste.id}>
                <a
                  style={{ textDecoration: "none", fontStyle: "italic" }}
                  href={`/artists/${artiste.id}`}
                >
                  {artiste.name} -{" "}
                </a>
              </span>
            ))
          ) : (
            <span style={{ fontSize: "0.75rem" }}>
              <a
                style={{ textDecoration: "none", fontStyle: "italic" }}
                href={`/artists/${object.artists[0].id}`}
              >
                {object.artists[0].name}
              </a>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
