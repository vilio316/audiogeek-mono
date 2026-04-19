import { useEffect, useState } from "react";
import { authClient } from "../lib/authClient";
import type { User } from "../types/user";
import { TopTracksPreview } from "./TopItems";
import RecentlyPlayed from "./RecentlyPlayed";

export default function DashboardPage() {
  const [userDetails, updateUserDetails] = useState({} as User);

  //User session check
  useEffect(() => {
    const checkUser = async () => {
      const sessionDetails = await authClient.getSession();
      const { data, error } = sessionDetails;
      if (!error && data) {
        updateUserDetails(data.user);
      }
      if (error) {
        window.alert("Login Unsuccessful");
      }
    };
    checkUser();
  }, []);

  const { name, image, id }: User = userDetails;

  return (
    <>
      <div className="p-2 my-2 flex gap-x-2 items-center">
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
      <p className="w-full text-center">Audiogeek. @vilio316 </p>
    </>
  );
}
