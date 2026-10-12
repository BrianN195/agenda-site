"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = createUserController;
exports.getUserController = getUserController;
exports.claimWeeklyRewardController = claimWeeklyRewardController;
const index_js_1 = require("../models/index.js");
const userService_js_1 = require("../services/userService.js");
async function createUserController(req, res) {
    try {
        const { username, email, passwordHash } = req.body;
        const user = await (0, userService_js_1.createUser)({
            username,
            email,
            passwordHash,
        });
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            coins: user.coins,
        });
    }
    catch (error) {
        console.error("Fehler beim Erstellen des Users:", error);
        res.status(500).json({
            error: "User konnte nicht erstellt werden.",
        });
    }
}
async function getUserController(req, res) {
    try {
        const userId = Number(req.params.id);
        const user = await index_js_1.User.findByPk(userId, {
            attributes: [
                "id",
                "username",
                "email",
                "coins",
                "lastWeeklyReward",
                "createdAt",
            ],
        });
        if (!user) {
            res.status(404).json({
                error: "User nicht gefunden.",
            });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error("Fehler beim Abrufen des Users:", error);
        res.status(500).json({
            error: "User konnte nicht abgerufen werden.",
        });
    }
}
async function claimWeeklyRewardController(req, res) {
    try {
        const userId = Number(req.params.id);
        const user = await (0, userService_js_1.claimWeeklyReward)(userId);
        res.json({
            message: "Weekly Reward erfolgreich vergeben.",
            coins: user.coins,
            lastWeeklyReward: user.lastWeeklyReward,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "USER_NOT_FOUND") {
                res.status(404).json({
                    error: "User nicht gefunden.",
                });
                return;
            }
            if (error.message === "REWARD_NOT_AVAILABLE") {
                res.status(409).json({
                    error: "Weekly Reward ist noch nicht verfügbar.",
                });
                return;
            }
        }
        console.error("Fehler beim Weekly Reward:", error);
        res.status(500).json({
            error: "Weekly Reward konnte nicht vergeben werden.",
        });
    }
}
