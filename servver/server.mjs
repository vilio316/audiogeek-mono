import express from "express";
import { auth } from "./src/auth/auth.mjs";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import spotifyRouter from "./apiRouter.mjs";
import { fetchWeekly } from "./services/musicBrainzService.mjs";

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  }),
);
app.set("trust proxy", 1);
app.use("/test", async (req, res) => {
  const test = await fetchWeekly();
  res.json(test);
});
app.use("/apii", spotifyRouter);
app.use("/api/auth", toNodeHandler(auth));

app.listen(7777, () => console.log("Listening on port 7777"));
