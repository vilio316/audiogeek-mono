import { useQuery } from "@tanstack/react-query";

export default function RecentlyPlayed() {
  const {
    data: recentlyPlayed,
    error,
    status,
  } = useQuery({
    queryKey: ["recently-played"],
    queryFn: async () => {
      {
        const recentlyRequest = await fetch(
          "https://audiogeek-mono.onrender.com/apii/recently-played",
          {
            credentials: "include",
          },
        );
        const recentlyRes = await recentlyRequest.json();
        return recentlyRes.items;
      }
    },
    staleTime: 3 * 60 * 1000,
  });

  return (
    <div className="p-6">
      <p className="text-xl font-bold my-4">Recently Played</p>
      <div>
        {recentlyPlayed &&
          recentlyPlayed.slice(0, 5).map((item: any) => (
            <div key={item.id} className="flex gap-x-4 items-center my-2 p-2">
              <div className="flex items-center">
                <div className="grid">
                  <img
                    src={item.track.album.images[1].url}
                    className="h-24 w-24"
                  />
                </div>
                <div style={{ padding: "0.5rem" }}>
                  <a
                    href={`/song/${item.track.id}`}
                    className="block"
                    style={{
                      fontSize: "1.25rem",
                      margin: "0.5rem",
                    }}
                  >
                    {item.track.name}
                  </a>
                  <a
                    className={`block`}
                    href={`/artists/${item.track.artists[0].id}`}
                  >
                    {item.track.album.artists[0].name}
                  </a>
                </div>
              </div>
              <RPItem item={item} />
            </div>
          ))}
      </div>
    </div>
  );
}

function RPItem(props: any) {
  const itemObj = props.item;
  const date = new Date();
  const playTime = new Date(itemObj.played_at);

  function generateRelativeTimeString() {
    const difference = date.valueOf() - playTime.valueOf();
    const seconds_val = Math.floor(difference / 1000);
    if (seconds_val < 60) {
      return `${seconds_val} secs ago`;
    }
    if (seconds_val > 60 && seconds_val < 3600) {
      return `${Math.floor(seconds_val / 60)} mins ago`;
    }
    if (seconds_val > 3600) {
      return `${Math.floor(seconds_val / 3600)} hrs ago`;
    }
  }

  return <p>{generateRelativeTimeString()}</p>;
}
