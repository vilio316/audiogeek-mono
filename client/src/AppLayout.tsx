import { Outlet } from "react-router";
import { MdOutlineMenu } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { authClient } from "./lib/authClient";
import { useState } from "react";

export default function AppLayout() {
  const [isHamburgerMenu, showHamburger] = useState(false);

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate("/"),
      },
    });
  }

  const navigate = useNavigate();
  return (
    <div className="px-1 md:px-2 mx-auto relative">
      <div className="flex w-full my-1 items-center sticky z-20 top-0 bg-white p-2">
        <Link to="/dashboard" className="text-2xl font-bold p-4 w-[95%]">
          Audiogeek
        </Link>
        <div className="flex gap-x-4">
          <MdOutlineMenu
            className="inline w-8 h-8 justify-self-end"
            onClick={() => showHamburger(true)}
          />
          <FiLogOut className="w-8 h-8 inline" onClick={logout} />
        </div>
      </div>
      <div
        className={`absolute top-0 right-0 p-4 text-xl font-bold ${isHamburgerMenu ? "grid" : "hidden"} z-20 bg-white md:w-1/4 w-full h-64`}
      >
        <span
          className="w-full text-right p-1 hover:text-red-600"
          onClick={() => showHamburger(false)}
        >
          x
        </span>
        <Link to="/dashboard" onClick={() => showHamburger(false)}>
          Home
        </Link>
        <Link to="/top" onClick={() => showHamburger(false)}>
          Your Top Items
        </Link>
        <Link to="/search" onClick={() => showHamburger(false)}>
          Search
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
