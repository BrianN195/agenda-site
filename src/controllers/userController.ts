import { Request, Response } from "express";
import { User } from "../models/index.js";
import {
  claimWeeklyReward,
  createUser,
} from "../services/userService.js";

export async function createUserController(
  req: Request,
  res: Response
) {
  try {
    const { username, email, passwordHash } = req.body;

    const user = await createUser({
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
  } catch (error) {
    console.error("Fehler beim Erstellen des Users:", error);

    res.status(500).json({
      error: "User konnte nicht erstellt werden.",
    });
  }
}

export async function getUserController(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(req.params.id);

    const user = await User.findByPk(userId, {
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
  } catch (error) {
    console.error("Fehler beim Abrufen des Users:", error);

    res.status(500).json({
      error: "User konnte nicht abgerufen werden.",
    });
  }
}

export async function claimWeeklyRewardController(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(req.params.id);

    const user = await claimWeeklyReward(userId);

    res.json({
      message: "Weekly Reward erfolgreich vergeben.",
      coins: user.coins,
      lastWeeklyReward: user.lastWeeklyReward,
    });
  } catch (error) {
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