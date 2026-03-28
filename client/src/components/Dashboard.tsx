import { useEffect, useState } from "react";
import { authClient } from "../lib/authClient";
import type { User } from "../types/user";
import { TopTracksPreview } from "./TopTracks";
import RecentlyPlayed from "./RecentlyPlayed";
import { FaHamburger } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function DashboardPage() {
  const [userDetails, updateUserDetails] = useState({} as User);

  useEffect(() => {
    const checkUser = async () => {
      const sessionDetails = await authClient.getSession();
      const { data, error } = sessionDetails;
      if (!error && data) {
        updateUserDetails(data.user);
      }
    };
    checkUser();
  }, []);

  const { name, image, id }: User = userDetails;

  return (
    <>
      <div className="flex w-full my-2 items-center">
        <p className="text-2xl font-bold p-4 w-[90%]">Audiogeek</p>
        <div className="flex gap-x-4">
          <FaHamburger className="inline w-8 h-8 justify-self-end" />
          <FiLogOut className="w-8 h-8 inline" />
        </div>
      </div>
      <div className="p-4 my-2 flex gap-x-2 items-center">
        <div>
          {image && <img src={image} className="w-24 h-24 rounded-full" />}
        </div>
        <div>
          <p>
            Hi there, <span className="font-bold">{name}</span>
          </p>
          <p>Your Spotify ID : {id}</p>
        </div>
      </div>
      <TopTracksPreview />
      <RecentlyPlayed />
      <p className="w-full text-center">
        Audiogeek. Developed in 2026 by vilio316{" "}
      </p>
    </>
  );
}
