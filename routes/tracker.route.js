import { Router } from "express";
import {
  getTodayVisits,
  logPageVisit,
} from "../controllers/tracker.controller.js";

const trackerRouter = Router();

trackerRouter.post("/track-visit", logPageVisit);

trackerRouter.get("/today-visits", getTodayVisits);

export default trackerRouter;
