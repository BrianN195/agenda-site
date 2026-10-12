import { Router } from "express";
import {
  createInvestmentController,
  getUserInvestmentsController,
  getUserPortfolioController,
} from "../controllers/investmentController.js";

const router = Router();

router.post("/", createInvestmentController);
router.get("/user/:id", getUserInvestmentsController);
router.get("/user/:id/portfolio", getUserPortfolioController);

export default router;