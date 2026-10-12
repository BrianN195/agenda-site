"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.claimWeeklyReward = claimWeeklyReward;
const index_js_1 = require("../models/index.js");
async function createUser(data) {
    const user = await index_js_1.User.create({
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        coins: 1000,
    });
    await index_js_1.Transaction.create({
        userId: user.id,
        type: "ADJUSTMENT",
        amount: 1000,
        balanceAfter: 1000,
        description: "Initial coin balance",
    });
    return user;
}
async function claimWeeklyReward(userId) {
    const user = await index_js_1.User.findByPk(userId);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    const now = new Date();
    if (user.lastWeeklyReward) {
        const millisecondsSinceReward = now.getTime() - user.lastWeeklyReward.getTime();
        const daysSinceReward = millisecondsSinceReward / (1000 * 60 * 60 * 24);
        if (daysSinceReward < 7) {
            throw new Error("REWARD_NOT_AVAILABLE");
        }
    }
    user.coins += 1000;
    user.lastWeeklyReward = now;
    await user.save();
    await index_js_1.Transaction.create({
        userId: user.id,
        type: "WEEKLY_REWARD",
        amount: 1000,
        balanceAfter: user.coins,
        description: "Weekly coin reward",
    });
    return user;
}
