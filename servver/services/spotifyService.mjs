import { mongo } from "../src/database/mongoDB.mjs";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

const spotifyTokenURL = "https://accounts.spotify.com/api/token";
dotenv.config();

/*
interface SpotifyAccount {
  userId: string;
  provider: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
*/
const refreshLocks = new Map();
export class SpotifyService {
  static async getAccount(userId) {
    const db = mongo;

    const account = await db.collection("account").findOne({
      userId: new ObjectId(userId),
      providerId: "spotify",
    });

    return account;
  }

  static async refreshToken(account) {
    const key = account._id.toString();
    if (refreshLocks.has(key)) {
      return refreshLocks.get(key); // return the in-flight promise
    }

    const refreshPromise = (async () => {
      try {
        const body = new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: account.refreshToken,
        });

        const basic = Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64");

        const res = await fetch(spotifyTokenURL, {
          method: "POST",
          headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        const data = await res.json();

        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token;
        const expiresIn = data.expires_in;

        if (!newAccessToken) {
          throw new Error(
            `Spotify token refresh failed: ${JSON.stringify(data)}`,
          );
        }

        const newExpiry = new Date(Date.now() + expiresIn * 1000);

        const db = mongo;

        await db.collection("account").updateOne(
          { _id: account._id },
          {
            $set: {
              accessToken: newAccessToken,
              expiresAt: newExpiry,
              ...(newRefreshToken && { refreshToken: newRefreshToken }),
            },
          },
        );

        return newAccessToken;
      } finally {
        refreshLocks.delete(key);
      }
    })();

    refreshLocks.set(key, refreshPromise);
    return refreshPromise;
  }

  static async getValidAccessToken(userId) {
    const account = await this.getAccount(userId);

    if (!account) {
      throw new Error("Spotify account not connected");
    }

    const expired = new Date(account.accessTokenExpiresAt) < new Date();

    if (!expired) {
      return account.accessToken;
    }
    return await this.refreshToken(account);
  }

  static async fetchSpotify(userId, endpoint) {
    const token = await this.getValidAccessToken(userId);

    const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Spotify API request failed");
    }

    return res.json();
  }
}
