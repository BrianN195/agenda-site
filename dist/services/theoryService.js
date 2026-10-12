"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheory = createTheory;
exports.getTheories = getTheories;
exports.getTheoryById = getTheoryById;
exports.updateTheoryStatus = updateTheoryStatus;
const index_js_1 = require("../models/index.js");
async function createTheory(data) {
    const user = await index_js_1.User.findByPk(data.createdBy);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    const theory = await index_js_1.Theory.create({
        title: data.title,
        description: data.description,
        createdBy: data.createdBy,
        status: "ACTIVE",
        currentValue: 100,
        peakValue: 100,
    });
    return theory;
}
async function getTheories() {
    return index_js_1.Theory.findAll({
        order: [["createdAt", "DESC"]],
    });
}
async function getTheoryById(theoryId) {
    return index_js_1.Theory.findByPk(theoryId, {
        include: [
            {
                model: index_js_1.User,
                as: "creator",
                attributes: ["id", "username"],
            },
        ],
    });
}
async function updateTheoryStatus(theoryId, status) {
    const theory = await index_js_1.Theory.findByPk(theoryId);
    if (!theory) {
        throw new Error("THEORY_NOT_FOUND");
    }
    const validStatuses = [
        "ACTIVE",
        "CONFIRMED",
        "DISPROVEN",
        "DORMANT",
        "REVIVED",
    ];
    if (!validStatuses.includes(status)) {
        throw new Error("INVALID_STATUS");
    }
    if (status === "DISPROVEN" &&
        theory.status !== "DISPROVEN") {
        theory.currentValue = 0;
    }
    if (status === "REVIVED" &&
        theory.status === "DISPROVEN") {
        theory.currentValue = Math.floor(theory.peakValue * 0.25);
    }
    theory.status = status;
    await theory.save();
    return theory;
}
