import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FaGreaterThan, FaLessThan } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";

export default function TopTracks({ time_range }: { time_range: string }) {
  const { data: value } = useQuery({
    queryKey: ["top_tracks", time_range],
    queryFn: async () => {
      const resultsReq = await fetch(
        `http://https://audiogeek-mono.onrender.com//apii/top-tracks/${time_range}`,
        {
          credentials: "include",
        },
      );
      return await resultsReq.json();
    },
  });

  return (
    <div className="p-2">
      <div className="grid md:grid-cols-5 md:gap-4 md:p-2">
        {value.map((item: any) => (
          <div key={item.id}>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopTracksPreview() {
  const { data, error, status } = useQuery({
    queryKey: ["top_tracks_short"],
    queryFn: async () => {
      const resultsReq = await fetch(
        "http://https://audiogeek-mono.onrender.com//apii/top-tracks/short_term",
        {
          credentials: "include",
        },
      );
      return await resultsReq.json();
    },
  });

  return (
    <div className="p-4">
      <p className="font-bold text-2xl">Your Top Tracks This Month</p>

      <div className="flex gap-x-4 items-center">
        <div className="flex md:gap-6 gap-x-4 md:py-2 w-[90%] overflow-x-scroll">
          {data.map((item: any) => (
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
        `http://https://audiogeek-mono.onrender.com//apii/top-artists/${range}`,
        {
          credentials: "include",
        },
      );
      return await resultsReq.json();
    },
  });

  return (
    <>
      <div className="grid md:grid-cols-5 gap-4">
        {artistsArray ? (
          <>
            {artistsArray.map((item: any) => (
              <div key={item.id}>
                <div className="place-items-center grid mt-3">
                  <img
                    className="md:h-48"
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

export function TopItemsImage({
  object,
  timeframe,
}: {
  object?: any;
  timeframe: string;
}) {
  const elementRef = useRef(null);
  const [activeTab, changeActiveTab] = useState(0);

  const { data: profileDetails } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await fetch(
        "http://https://audiogeek-mono.onrender.com//apii/profile",
        {
          credentials: "include",
        },
      );
      const profileRes = await profile.json();
      return profileRes;
    },
  });

  return (
    <div className="text-white p-2 md:p-4">
      <div className="md:flex gap-x-4 p-2 items-center">
        <img
          src={profileDetails.images ? profileDetails.images[0].url : null}
          alt="User PFP"
          className="rounded-full h-20"
        />
        <div>
          <p className="font-bold text-2xl">
            Hi, {profileDetails.display_name}
          </p>
          <p>Here's your {timeframe} listening review!</p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2">
        <div className="tabs flex items-center">
          <FaLessThan
            onClick={() => {
              if (activeTab !== 0) {
                changeActiveTab(0);
              } else {
                changeActiveTab(1);
              }
            }}
          />
          <div>
            {activeTab === 1 ? (
              <ArtistsImageView time_range={timeframe} />
            ) : (
              <TracksShort time_range={timeframe} />
            )}
          </div>
          <FaGreaterThan
            onClick={() => {
              if (activeTab < 1) {
                changeActiveTab(1);
              } else {
                changeActiveTab(0);
              }
            }}
          />
        </div>
        <div className="image_html" ref={elementRef}></div>
      </div>
      <div className="text-right w-full">
        <p className="font-bold text-xl">audiogeek</p>
        <p>&copy; 2026</p>
      </div>
    </div>
  );
}

function ArtistsImageView({ time_range }: { time_range: string }) {
  const { data: artists } = useQuery({
    queryKey: ["top_artists", time_range],
    queryFn: async () => {
      const resultsReq = await fetch(
        `http://https://audiogeek-mono.onrender.com//apii/top-artists/${time_range}`,
        {
          credentials: "include",
        },
      );
      const resultResponse = await resultsReq.json();
      return resultResponse;
    },
  });

  return (
    <div className="p-2 md:p-4">
      <p className="font-bold text-lg underline">Your Top Artists</p>
      {artists.slice(0, 5).map((artist: any) => (
        <div className="flex gap-x-1 md:gap-x-2 items-center" key={artist.id}>
          <img
            className="md:h-16 md:w-16 w-12 h-12 md:my-4 my-2 rounded-full"
            src={artist.images[0].url}
            alt={artist.name}
            loading="lazy"
          />
          <p className="text-left indent-2 md:indent-4 font-bold">
            {artist.name}
          </p>
        </div>
      ))}
    </div>
  );
}

function TracksShort({ time_range }: { time_range: string }) {
  const { data, error, status } = useQuery({
    queryKey: ["top_tracks", time_range],
    queryFn: async () => {
      const resultsReq = await fetch(
        `http://https://audiogeek-mono.onrender.com//apii/top-tracks/${time_range}`,
        {
          credentials: "include",
        },
      );
      return await resultsReq.json();
    },
  });

  return (
    <div className="grid md:grid-cols-5 md:gap-4 md:p-2">
      {data.map((item: any) => (
        <div key={item.id}>
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
        </div>
      ))}
    </div>
  );
}
