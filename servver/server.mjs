import express from "express";
import { auth } from "./src/auth/auth.mjs";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import spotifyRouter from "./apiRouter.mjs";
import geniusRouter from "./geniusRouter.mjs";

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  }),
);
app.set("trust proxy", 1);
app.use("/apii", spotifyRouter);
app.use("/genius", geniusRouter);
app.use("/api/auth", toNodeHandler(auth));

app.listen(7777, () => console.log("Listening on port 7777"));
