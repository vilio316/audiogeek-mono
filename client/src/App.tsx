import { authClient } from "./lib/authClient";

function App() {
  async function login() {
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL: "http://127.0.0.1:5173/dashboard",
    });
  }

  return (
    <div className="grid place-items-center">
      <button onClick={login} className="block">
        Log in with Spotify
      </button>
    </div>
  );
}

export default App;
