import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dotenv from "dotenv";
import { mongo } from "../database/mongoDB.mjs";
dotenv.config();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(mongo),
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      scope: [
        "user-read-email",
        "user-top-read",
        "user-read-recently-played",
        "user-read-private",
        "user-follow-read",
        "user-read-email",
        "user-read-currently-playing",
        "user-read-playback-state",
        "playlist-read-private",
        "playlist-read-collaborative",
        ,
      ],
    },
  },
  trustedOrigins: ["http://127.0.0.1:5173"],
});
