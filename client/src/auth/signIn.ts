import { authClient } from "../lib/authClient";

await authClient.signIn.social({
  provider: "spotify",
});
