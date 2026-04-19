import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Link } from "react-router";

const Artist_Albums = () => {
  let artist_id = useParams();
  const { data, error, isSuccess } = useQuery({
    queryKey: ["artist-albums", artist_id],
    queryFn: async () => {
      const albumsRequest = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/artist-albums/${artist_id.id}`,
        {
          credentials: "include",
        },
      );
      const albumResponse = await albumsRequest.json();
      return albumResponse.items;
    },
    staleTime: 3 * 24 * 60 * 60 * 1000,
  });
  return (
    <>
      <h2>
        <u>Top Albums</u>
      </h2>
      {isSuccess ? (
        <>
          <div
            className="artist_albums"
            style={{ display: "grid", width: "100%" }}
          >
            {data.map((item: any) => (
              <Link
                key={item.id}
                style={{ padding: "0.75rem", margin: "0.25rem" }}
                to={`/albums/${item.id}`}
              >
                <div style={{ display: "grid", justifyItems: "center" }}>
                  <img
                    src={item.images[1].url}
                    alt={item.name}
                    style={{
                      width: "90%",
                    }}
                  />
                </div>

                <p
                  className="albumTitle"
                  style={{
                    fontSize: "1.25rem",
                    width: "10rem",
                    textAlign: "left",
                  }}
                >
                  <a href={`/albums/${item.id}`}>{item.name}</a>
                </p>
                <p>
                  <span>{item.artists[0].name}</span>
                  <span style={{ padding: "0 0.25rem", fontSize: "0.75rem" }}>
                    {item.release_date}
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          {error ? (
            <>
              <p>Error Encountered!</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </>
  );
};

export default function ArtistInformation() {
  const params = useParams();

  const { data, isSuccess } = useQuery({
    queryKey: ["artist_details", params.id],
    queryFn: async () => {
      const artistsRequest = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/artist/${params.id}`,
        {
          credentials: "include",
        },
      );
      const artistsResponse = await artistsRequest.json();
      return artistsResponse;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <>
      {isSuccess && (
        <>
          <div className="artiste_header flex gap-x-4 p-4">
            <div className="grid place-items-center">
              <img
                src={data.images[0].url}
                className="rounded-full object-cover w-40 h-40"
              ></img>
            </div>

            <div style={{ alignContent: "center" }}>
              <h2>{data.name}</h2>
              <span></span>
            </div>
            <Artist_Albums />
          </div>
        </>
      )}
    </>
  );
}
