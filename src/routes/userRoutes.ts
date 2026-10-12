import { Router } from "express";
import {
  claimWeeklyRewardController,
  createUserController,
  getUserController,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUserController);
router.get("/:id", getUserController);
router.post("/:id/weekly-reward", claimWeeklyRewardController);

export default router;