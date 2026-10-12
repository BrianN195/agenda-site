"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_js_1 = require("../controllers/userController.js");
const router = (0, express_1.Router)();
router.post("/", userController_js_1.createUserController);
router.get("/:id", userController_js_1.getUserController);
router.post("/:id/weekly-reward", userController_js_1.claimWeeklyRewardController);
exports.default = router;
