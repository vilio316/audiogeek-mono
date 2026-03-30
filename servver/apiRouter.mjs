import express from "express";
import { auth } from "./src/auth/auth.mjs";
import { SpotifyService } from "./services/spotifyService.mjs";

const spotifyRouter = express.Router();

spotifyRouter.get("/top-tracks/:time_range", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const tracks = await SpotifyService.fetchSpotify(
    session.user.id,
    `me/top/tracks?limit=${50}&time_range=${req.params.time_range}`,
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

spotifyRouter.get("/profile", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const userProfile = await SpotifyService.fetchSpotify(session.user.id, `/me`);
  res.json(userProfile);
});

spotifyRouter.get("/profile-playlists", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const profilePlaylists = await SpotifyService.fetchSpotify(
    session.user.id,
    `/me/playlists`,
  );
  res.json(profilePlaylists);
});

spotifyRouter.get("/top-artists/:timeRange", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const topArtists = await SpotifyService.fetchSpotify(
    session.user.id,
    `/me/top/artists?time_range=${req.params.timeRange}&limit=30`,
  );
  res.json(topArtists);
});

spotifyRouter.get("/playlist/:id", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const playlist = await SpotifyService.fetchSpotify(
    session.user.id,
    `playlists/${req.params.id}`,
  );

  res.json(playlist);
});

spotifyRouter.get("/track/:id", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const track = await SpotifyService.fetchSpotify(
    session.user.id,
    `tracks/${req.params.id}`,
  );

  res.json(track);
});

spotifyRouter.get("/artist/:id", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const artist = await SpotifyService.fetchSpotify(
    session.user.id,
    `artists/${req.params.id}`,
  );
  res.json(artist);
});

spotifyRouter.get("/album/:id", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const album = await SpotifyService.fetchSpotify(
    session.user.id,
    `/albums/${req.params.id}`,
  );
  res.json(album);
});

//broken, 400 Bad Request
spotifyRouter.get("/artist-albums/:id", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const artistAlbums = await SpotifyService.fetchSpotify(
    session.user.id,
    `/artists/${req.params.id}/albums?limit=20`,
  );

  res.json(artistAlbums);
});

spotifyRouter.get("/search/:queryTerm", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const searchResults = await SpotifyService.fetchSpotify(
    session.user.id,
    `/search?q=${req.params.queryTerm}&type=artist,track`,
  );
  res.json(searchResults);
});

spotifyRouter.get("/player", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const player = await SpotifyService.fetchSpotify(
    session.user.id,
    `/me/player`,
  );
  res.json(player);
});

spotifyRouter.get("/currently-playing", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const currentlyPlaying = await SpotifyService.fetchSpotify(
    session.user.id,
    `me/player/currently-playing`,
  );
  res.json(currentlyPlaying);
});
export default spotifyRouter;
