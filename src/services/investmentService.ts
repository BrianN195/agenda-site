import sequelize from "../config/database.js";
import { Investment, Theory, Transaction, User } from "../models/index.js";

interface CreateInvestmentData {
  userId: number;
  theoryId: number;
  type: "LONG" | "SHORT";
  amount: number;
}

export async function createInvestment(data: CreateInvestmentData) {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(data.userId, {
      transaction,
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const theory = await Theory.findByPk(data.theoryId, {
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

    const investment = await Investment.create(
      {
        userId: user.id,
        theoryId: theory.id,
        type: data.type,
        amount: investedAmount,
        shares,
        purchasePrice,
      },
      {
        transaction,
      }
    );

    await Transaction.create(
      {
        userId: user.id,
        type: "INVESTMENT",
        amount: -investedAmount,
        balanceAfter: user.coins,
        description: `Investment in theory #${theory.id}`,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return investment;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}

export async function getInvestmentsByUser(userId: number) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return Investment.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Theory,
        as: "theory",
        attributes: ["id", "title", "status", "currentValue"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

export async function getUserPortfolio(userId: number) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const investments = await Investment.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Theory,
        as: "theory",
        attributes: ["id", "title", "status", "currentValue"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const portfolioInvestments = investments.map((investment) => {
    const theory = investment.get("theory") as Theory;

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

  const totalInvested = portfolioInvestments.reduce(
    (total, investment) => total + investment.invested,
    0,
  );

  const totalCurrentWorth = portfolioInvestments.reduce(
    (total, investment) => total + investment.currentWorth,
    0,
  );

  return {
    coins: user.coins,
    totalInvested,
    totalCurrentWorth,
    totalProfit: totalCurrentWorth - totalInvested,
    investments: portfolioInvestments,
  };
}
