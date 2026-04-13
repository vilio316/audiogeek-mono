import dotenv from "dotenv";

dotenv.config();

let headers = new Headers();
headers.append("Authorization", `Bearer ${process.env.GENIUS_TOKEN}`);

let baseAPI = `https://api.genius.com`;

export class GeniusService {
  static async getTrack(id) {
    const track = await fetch(`https://api.genius.com/songs/${id}`, {
      headers: headers,
      credentials: "include",
    });
    return await track.json();
  }

  static async searchForItem(query) {
    const searchResults = await fetch(`${baseAPI}/search/q=${query}`, {
      headers: headers,
      credentials: "include",
    });
    return await searchResults.json();
  }
}
