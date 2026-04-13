import express from "express";
import { GeniusService } from "./services/geniusService.mjs";

const geniusRouter = express.Router();

geniusRouter.get("/song/:ID", async (req, res) => {
  const song = await GeniusService.getTrack(req.params.ID);
  res.json(song);
});

geniusRouter.get("/search/:query", async (req, res) => {
  const result = await GeniusService.searchForItem(req.params.query);
  res.json(result);
});

export default geniusRouter;
