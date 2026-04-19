import { Outlet } from "react-router";
import { FaHamburger } from "react-icons/fa";
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
    <div className="p-2 md:p-4 mx-auto relative">
      <div className="flex w-full my-1 items-center">
        <Link to="/dashboard" className="text-2xl font-bold p-4 w-[95%]">
          Audiogeek
        </Link>
        <div className="flex gap-x-4">
          <FaHamburger
            className="inline w-8 h-8 justify-self-end"
            onClick={() => showHamburger(true)}
          />
          <FiLogOut className="w-8 h-8 inline" onClick={logout} />
        </div>
      </div>
      <div
        className={`absolute top-0 right-0 p-4 text-xl font-bold ${isHamburgerMenu ? "grid" : "hidden"} z-20 bg-white w-1/4 md:h-64 h-48`}
      >
        <span
          className="w-full text-right p-1 hover:text-red-600"
          onClick={() => showHamburger(false)}
        >
          x
        </span>
        <Link to="/dashboard">Home</Link>
        <a>Home</a>
        <a>Home</a>
        <a>Home</a>
        <a>Home</a>
      </div>
      <Outlet />
    </div>
  );
}
