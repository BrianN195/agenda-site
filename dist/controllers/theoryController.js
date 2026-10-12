"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheoryController = createTheoryController;
exports.getTheoriesController = getTheoriesController;
exports.getTheoryByIdController = getTheoryByIdController;
exports.updateTheoryStatusController = updateTheoryStatusController;
const theoryService_js_1 = require("../services/theoryService.js");
async function createTheoryController(req, res) {
    try {
        const { title, description, createdBy } = req.body;
        const theory = await (0, theoryService_js_1.createTheory)({
            title,
            description,
            createdBy: Number(createdBy),
        });
        res.status(201).json({
            id: theory.id,
            title: theory.title,
            description: theory.description,
            status: theory.status,
            currentValue: theory.currentValue,
            peakValue: theory.peakValue,
            createdBy: theory.createdBy,
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "USER_NOT_FOUND") {
            res.status(404).json({
                error: "User nicht gefunden.",
            });
            return;
        }
        console.error("Fehler beim Erstellen der Theorie:", error);
        res.status(500).json({
            error: "Theorie konnte nicht erstellt werden.",
        });
    }
}
async function getTheoriesController(_req, res) {
    try {
        const theories = await (0, theoryService_js_1.getTheories)();
        res.json(theories);
    }
    catch (error) {
        console.error("Fehler beim Abrufen der Theorien:", error);
        res.status(500).json({
            error: "Theorien konnten nicht abgerufen werden.",
        });
    }
}
async function getTheoryByIdController(req, res) {
    try {
        const theoryId = Number(req.params.id);
        const theory = await (0, theoryService_js_1.getTheoryById)(theoryId);
        if (!theory) {
            res.status(404).json({
                error: "Theorie nicht gefunden.",
            });
            return;
        }
        res.json(theory);
    }
    catch (error) {
        console.error("Fehler beim Abrufen der Theorie:", error);
        res.status(500).json({
            error: "Theorie konnte nicht abgerufen werden.",
        });
    }
}
async function updateTheoryStatusController(req, res) {
    try {
        const theoryId = Number(req.params.id);
        const { status } = req.body;
        const theory = await (0, theoryService_js_1.updateTheoryStatus)(theoryId, status);
        res.json({
            id: theory.id,
            title: theory.title,
            status: theory.status,
            currentValue: theory.currentValue,
            peakValue: theory.peakValue,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "THEORY_NOT_FOUND") {
                res.status(404).json({
                    error: "Theorie nicht gefunden.",
                });
                return;
            }
            if (error.message === "INVALID_STATUS") {
                res.status(400).json({
                    error: "Ungültiger Theorie-Status.",
                });
                return;
            }
        }
        console.error("Fehler beim Ändern des Theorie-Status:", error);
        res.status(500).json({
            error: "Theorie-Status konnte nicht geändert werden.",
        });
    }
}
