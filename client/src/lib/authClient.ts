import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "https://audiogeek-mono.onrender.com",
  fetchOptions: {
    credentials: "include",
  },
});

/*

*/
