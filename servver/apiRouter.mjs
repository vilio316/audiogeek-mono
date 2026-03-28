import express from "express";
import { auth } from "./src/auth/auth.mjs";
import { SpotifyService } from "./services/spotifyService.mjs";

const spotifyRouter = express.Router();

spotifyRouter.get("/top-tracks", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const tracks = await SpotifyService.fetchSpotify(
    session.user.id,
    `me/top/tracks?limit=${50}&time_range=short_term`,
  );

  res.json(tracks);
});

spotifyRouter.get("/recently-played", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const recentlyPlayed = await SpotifyService.fetchSpotify(
    session.user.id,
    `/me/player/recently-played?limit=50&after=1754930000000`,
  );

  res.json(recentlyPlayed);
});

export default spotifyRouter;
