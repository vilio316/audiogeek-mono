import { useEffect, useState } from "react";
import { authClient } from "../lib/authClient";
import type { User } from "../types/user";

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
  }, [userDetails]);

  const { name, image, id }: User = userDetails;

  return (
    <div className="p-4 my-2">
      {image && <img src={image} className="w-16 h-16 rounded-2xl" />}
      <p>
        Hi there, <span className="font-bold">{name}</span>
      </p>
      <p>Your Spotify ID : {id}</p>
    </div>
  );
}
