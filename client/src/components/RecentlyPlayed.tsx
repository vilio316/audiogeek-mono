import { useQuery } from "@tanstack/react-query";

export default function RecentlyPlayed() {
  const {
    data: recentlyPlayed,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["recently-played"],
    queryFn: async () => {
      {
        const recentlyRequest = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/apii/recently-played`,
          {
            credentials: "include",
          },
        );
        const recentlyRes = await recentlyRequest.json();
        return recentlyRes.items;
      }
    },
    staleTime: 3 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
  });

  return (
    <div className="md:p-4 p-2 md:w-1/3">
      <p className="text-xl font-bold my-4">Recently Played</p>
      <div>
        {isSuccess &&
          recentlyPlayed.slice(0, 5).map((item: any) => (
            <div key={item.id} className="grid items-center my-2 p-2">
              <div className="grid grid-cols-6 gap-x-2 md:gap-x-4 items-center">
                <div className="grid col-span-2 place-items-center">
                  <img
                    src={item.track.album.images[1].url}
                    className="h-24 w-24"
                  />
                </div>
                <div className="md:p-2 col-span-3">
                  <a href={`/song/${item.track.id}`} className="block">
                    {item.track.name}
                  </a>
                  <a
                    className={`block text-sm`}
                    href={`/artists/${item.track.artists[0].id}`}
                  >
                    {item.track.album.artists[0].name}
                  </a>
                </div>
                <RPItem item={item} />
              </div>
            </div>
          ))}
        {isLoading && <p>Loading recently played songs...</p>}
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
      return `${seconds_val} s ago`;
    }
    if (seconds_val > 60 && seconds_val < 3600) {
      return `${Math.floor(seconds_val / 60)} m ago`;
    }
    if (seconds_val > 3600) {
      return `${Math.floor(seconds_val / 3600)} h ago`;
    }
  }

  return <p className="text-right">{generateRelativeTimeString()}</p>;
}
