import { FaSpotify } from "react-icons/fa6";
import { authClient } from "./lib/authClient";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();

  async function login() {
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL: "http://127.0.0.1:5173/dashboard",
    });
  }

  useEffect(() => {
    const checkUser = async () => {
      const sessionDetails = await authClient.getSession();
      const { data, error } = sessionDetails;
      if (!error && data) {
        navigate("/dashboard");
      }
      if (error) {
        window.alert("Login Unsuccessful");
      }
    };
    checkUser();
  }, []);

  return (
    <div className="grid place-items-center h-screen w-full">
      <button
        onClick={login}
        className="flex bg-emerald-500 w-1/4 rounded-2xl p-2 justify-center items-center gap-x-4"
      >
        <FaSpotify className="inline h-6 w-6" />
        <span className="text-xl font-bold">Log in with Spotify</span>
      </button>
    </div>
  );
}

export default App;
