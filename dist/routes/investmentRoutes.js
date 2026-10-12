"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const investmentController_js_1 = require("../controllers/investmentController.js");
const router = (0, express_1.Router)();
router.post("/", investmentController_js_1.createInvestmentController);
router.get("/user/:id", investmentController_js_1.getUserInvestmentsController);
router.get("/user/:id/portfolio", investmentController_js_1.getUserPortfolioController);
exports.default = router;
