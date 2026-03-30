import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

export default function TopTracks() {
  const [value, updateValue] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      const resultsReq = await fetch("http://127.0.0.1:7777/apii/top-tracks", {
        credentials: "include",
      });
      const resultResponse = await resultsReq.json();
      updateValue(resultResponse.items);
    };
    fetchTopTracks();
  }, []);

  return (
    <div className="p-4">
      <p>Now showing user top tracks</p>

      <div className="grid md:grid-cols-5 md:gap-4 md:p-4">
        {value.map((item: any) => (
          <div key={item.id}>
            <div className="grid place-items-center">
              <img
                className=""
                src={item.album.images[0].url}
                alt={item.name}
              />
            </div>
            <div
              className="grid"
              style={{
                justifyContent: "center",
              }}
            >
              <p className="text-center truncate ">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopTracksPreview() {
  const [value, updateValue] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      const resultsReq = await fetch(
        "http://127.0.0.1:7777/apii/top-tracks/short_term",
        {
          credentials: "include",
        },
      );
      const resultResponse = await resultsReq.json();
      updateValue(resultResponse.items);
    };
    fetchTopTracks();
  }, []);

  return (
    <div className="p-4">
      <p className="font-bold text-2xl">Your Top Tracks This Month</p>

      <div className="flex gap-x-4 items-center">
        <div className="flex md:gap-6 gap-x-4 md:py-2 w-[90%] overflow-x-scroll">
          {value.map((item: any) => (
            <div key={item.id} className="inline-block shrink-0">
              <div className="grid place-items-center">
                <img
                  className="h-48 w-48"
                  src={item.album.images[0].url}
                  alt={item.name}
                />
              </div>
              <div
                className="grid"
                style={{
                  justifyContent: "center",
                }}
              >
                <p className="text-center truncate w-40 md:my-2 font-bold ">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <FiArrowRight className="inline w-8 h-8 rounded-full p-1 hover:bg-green-600 hover:text-white" />
      </div>
    </div>
  );
}
