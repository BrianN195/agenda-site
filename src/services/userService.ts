import { User, Transaction } from "../models/index.js";

interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
}

export async function createUser(data: CreateUserData) {
  const user = await User.create({
    username: data.username,
    email: data.email,
    passwordHash: data.passwordHash,
    coins: 1000,
  });

  await Transaction.create({
    userId: user.id,
    type: "ADJUSTMENT",
    amount: 1000,
    balanceAfter: 1000,
    description: "Initial coin balance",
  });

  return user;
}

export async function claimWeeklyReward(userId: number) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const now = new Date();

  if (user.lastWeeklyReward) {
    const millisecondsSinceReward =
      now.getTime() - user.lastWeeklyReward.getTime();

    const daysSinceReward =
      millisecondsSinceReward / (1000 * 60 * 60 * 24);

    if (daysSinceReward < 7) {
      throw new Error("REWARD_NOT_AVAILABLE");
    }
  }

  user.coins += 1000;
  user.lastWeeklyReward = now;

  await user.save();

  await Transaction.create({
    userId: user.id,
    type: "WEEKLY_REWARD",
    amount: 1000,
    balanceAfter: user.coins,
    description: "Weekly coin reward",
  });

  return user;
}