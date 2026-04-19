import * as htmlToImage from "html-to-image";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TracksShort } from "./TopItems";
import {
  FaDownload,
  FaShare,
  FaLessThan,
  FaGreaterThan,
} from "react-icons/fa6";

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
      text: "Spotify Review (Generated from Audiogeek)!",
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
          <div className="flex gap-x-4 p-2 items-center">
            <img
              src={profileDetails.images ? profileDetails.images[0].url : null}
              alt="User PFP"
              className="rounded-full h-20"
            />
            <div>
              <p className="font-bold text-2xl">
                {resolveTimeRangeToString(timeframe)} Listening Review for{" "}
                {profileDetails.display_name}
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
            <div className="tabs flex items-center md:gap-x-4 gap-x-2">
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
    <div className="p-2 md:p-4 w-80vw">
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
