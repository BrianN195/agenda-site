import { Router } from "express";
import {
  createTheoryController,
  getTheoriesController,
  getTheoryByIdController,
  updateTheoryStatusController,
} from "../controllers/theoryController.js";

const router = Router();

router.get("/", getTheoriesController);
router.get("/:id", getTheoryByIdController);
router.post("/", createTheoryController);
router.patch("/:id/status", updateTheoryStatusController);


export default router;