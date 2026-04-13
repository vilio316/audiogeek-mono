import { useQuery } from "@tanstack/react-query";

export default function TestRoute() {
  const { data, isSuccess } = useQuery({
    queryKey: ["genius-song-test"],
    queryFn: async () => {
      const request = await fetch("http://127.0.0.1:7777/genius/song/7554819");
      return await request.json();
    },
    staleTime: Infinity,
  });

  return (
    <>
      {isSuccess ? (
        <p>
          Song Found!
          {data.response.song.title}
        </p>
      ) : (
        <p>Waiting</p>
      )}
    </>
  );
}
