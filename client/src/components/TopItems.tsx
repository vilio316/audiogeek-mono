import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  FaDownload,
  FaGreaterThan,
  FaLessThan,
  FaShare,
} from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";
import * as htmlToImage from "html-to-image";

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
        <div className="flex md:gap-6 gap-x-4 md:py-2 w-[90%] overflow-x-scroll">
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
                    className="h-48 w-48"
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

export function TopItemsImage({
  timeframe,
}: {
  object?: any;
  timeframe: string;
}) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, changeActiveTab] = useState(0);

  const { data: profileDetails } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/profile`,
        {
          credentials: "include",
        },
      );
      const profileRes = await profile.json();
      return profileRes;
    },
    staleTime: 7 * 24 * 60 * 60 * 1000,
  });

  const downloadHandler = async (timeframe: string) => {
    if (!elementRef.current) return;
    const dataURL = await htmlToImage.toPng(elementRef.current, {
      quality: 0.75,
    });

    const link = document.createElement("a");
    link.download = `user_review-${timeframe}.png`;
    link.href = dataURL;
    link.click();
  };

  const makeImageToShare = async (timeframe: string) => {
    if (!elementRef.current) return;
    const fileBlob = await htmlToImage.toBlob(elementRef.current);
    if (!fileBlob) return null;
    const createdFile = new File([fileBlob], `user_review_${timeframe}.png`, {
      type: `image/png`,
    });
    return createdFile;
  };

  async function shareImage(timeframe: string): Promise<void> {
    if (!navigator.canShare || !navigator.share) {
      throw new Error("Web Share API not supported");
    }
    const file = await makeImageToShare(timeframe);

    if (!file) {
      throw new Error("File could not be generated");
    }
    const canShareFiles = navigator.canShare({
      files: [file],
    });

    if (!canShareFiles) {
      throw new Error("File sharing not supported on this device");
    }

    await navigator.share({
      files: [file],
      title: "Shared Image",
      text: "Check this out!",
    });
  }

  const resolveTimeRangeToString = (time_range: string) => {
    if (time_range === "short_term") return "4-week";
    if (time_range === "medium_term") return "6-month";
    if (time_range === "long_term") return "1 year+";
    console.log(time_range);
  };

  return (
    <>
      {profileDetails && (
        <div
          className="text-white bg-linear-150 from-purple-900/90 to-gray-500 p-2 md:p-4"
          ref={elementRef}
        >
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
              <p>
                Here's your {resolveTimeRangeToString(timeframe)} listening
                review!
              </p>
            </div>
            <div className="flex gap-x-4 items-center">
              <FaDownload
                onClick={() => downloadHandler(timeframe)}
                className="w-6 h-6 inline"
              />
              <FaShare
                className="w-6 h-6 inline"
                onClick={() => {
                  shareImage(timeframe);
                }}
              />
            </div>
          </div>

          <div className="grid">
            <div className="tabs flex items-center md:gap-x-6">
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
          </div>
          <div className="text-right w-full">
            <p className="font-bold text-xl">audiogeek</p>
            <p>&copy; 2026</p>
          </div>
        </div>
      )}
    </>
  );
}

function ArtistsImageView({ time_range }: { time_range: string }) {
  const { data: artists } = useQuery({
    queryKey: ["top_artists", time_range],
    queryFn: async () => {
      const resultsReq = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/apii/top-artists/${time_range}`,
        {
          credentials: "include",
        },
      );
      const resultResponse = await resultsReq.json();
      return resultResponse.items;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <div className="p-2 md:p-4">
      <p className="font-bold text-lg underline">Your Top Artists</p>

      {artists &&
        artists.slice(0, 5).map((artist: any) => (
          <div className="flex gap-x-1 md:gap-x-2 items-center" key={artist.id}>
            <img
              className="w-12 h-12 my-2 rounded-full"
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
