import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://127.0.0.1:7777",
  fetchOptions: {
    credentials: "include",
  },
});

/*

*/
