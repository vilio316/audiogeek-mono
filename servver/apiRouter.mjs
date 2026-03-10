import express from "express";
import { auth } from "./src/auth/auth.mjs";
import { mongo } from "./src/database/mongoDB.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/spotify-token", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const db = mongo;

  const account = await db.collection("accounts").findOne({
    userId: new ObjectId(session.user.id),
    providerId: "spotify",
  });

  if (!account) {
    return res.status(404).json({ error: "Spotify account not found" });
  }

  res.json({
    accessToken: account.accessToken,
  });
});

router.get("/top-tracks", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) return res.status(401).end();
  const db = mongo;

  const account = await db.collection("account").findOne({
    userId: new ObjectId(session.user.id),
    providerId: "spotify",
  });

  const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${account.accessToken}`,
    },
  });

  const data = await response.json();

  res.json(data);
});

router.get("/following", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) return res.status(401).end();
  const db = mongo;

  const account = await db.collection("account").findOne({
    userId: new ObjectId(session.user.id),
    providerId: "spotify",
  });

  const response = await fetch(
    "https://api.spotify.com/v1/me/following?type=artist",
    {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    },
  );

  const data = await response.json();

  res.json(data);
});

export default router;
