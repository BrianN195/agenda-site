"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvestment = createInvestment;
exports.getInvestmentsByUser = getInvestmentsByUser;
exports.getUserPortfolio = getUserPortfolio;
const database_js_1 = __importDefault(require("../config/database.js"));
const index_js_1 = require("../models/index.js");
async function createInvestment(data) {
    const transaction = await database_js_1.default.transaction();
    try {
        const user = await index_js_1.User.findByPk(data.userId, {
            transaction,
        });
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        const theory = await index_js_1.Theory.findByPk(data.theoryId, {
            transaction,
        });
        if (!theory) {
            throw new Error("THEORY_NOT_FOUND");
        }
        if (data.amount <= 0) {
            throw new Error("INVALID_AMOUNT");
        }
        if (data.type !== "LONG") {
            throw new Error("SHORT_NOT_IMPLEMENTED");
        }
        if (user.coins < data.amount) {
            throw new Error("INSUFFICIENT_COINS");
        }
        const purchasePrice = theory.currentValue;
        const shares = Math.floor(data.amount / purchasePrice);
        if (shares <= 0) {
            throw new Error("AMOUNT_TOO_LOW");
        }
        const investedAmount = shares * purchasePrice;
        user.coins -= investedAmount;
        const valueIncrease = Math.floor(investedAmount / 10);
        theory.currentValue += valueIncrease;
        if (theory.currentValue > theory.peakValue) {
            theory.peakValue = theory.currentValue;
        }
        await user.save({ transaction });
        await theory.save({ transaction });
        const investment = await index_js_1.Investment.create({
            userId: user.id,
            theoryId: theory.id,
            type: data.type,
            amount: investedAmount,
            shares,
            purchasePrice,
        }, {
            transaction,
        });
        await index_js_1.Transaction.create({
            userId: user.id,
            type: "INVESTMENT",
            amount: -investedAmount,
            balanceAfter: user.coins,
            description: `Investment in theory #${theory.id}`,
        }, {
            transaction,
        });
        await transaction.commit();
        return investment;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
async function getInvestmentsByUser(userId) {
    const user = await index_js_1.User.findByPk(userId);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return index_js_1.Investment.findAll({
        where: {
            userId,
        },
        include: [
            {
                model: index_js_1.Theory,
                as: "theory",
                attributes: ["id", "title", "status", "currentValue"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
}
async function getUserPortfolio(userId) {
    const user = await index_js_1.User.findByPk(userId);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    const investments = await index_js_1.Investment.findAll({
        where: {
            userId,
        },
        include: [
            {
                model: index_js_1.Theory,
                as: "theory",
                attributes: ["id", "title", "status", "currentValue"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
    const portfolioInvestments = investments.map((investment) => {
        const theory = investment.get("theory");
        const currentWorth = investment.shares * theory.currentValue;
        const profit = currentWorth - investment.amount;
        return {
            id: investment.id,
            theoryId: investment.theoryId,
            theory: theory.title,
            type: investment.type,
            shares: investment.shares,
            purchasePrice: investment.purchasePrice,
            currentValue: theory.currentValue,
            invested: investment.amount,
            currentWorth,
            profit,
            status: theory.status,
        };
    });
    const totalInvested = portfolioInvestments.reduce((total, investment) => total + investment.invested, 0);
    const totalCurrentWorth = portfolioInvestments.reduce((total, investment) => total + investment.currentWorth, 0);
    return {
        coins: user.coins,
        totalInvested,
        totalCurrentWorth,
        totalProfit: totalCurrentWorth - totalInvested,
        investments: portfolioInvestments,
    };
}
