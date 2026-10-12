import { Request, Response } from "express";
import {
  createInvestment,
  getInvestmentsByUser,
  getUserPortfolio,
} from "../services/investmentService.js";

export async function createInvestmentController(
  req: Request,
  res: Response
) {
  try {
    const { userId, theoryId, type, amount } = req.body;

    const investment = await createInvestment({
      userId: Number(userId),
      theoryId: Number(theoryId),
      type,
      amount: Number(amount),
    });

    res.status(201).json({
      id: investment.id,
      userId: investment.userId,
      theoryId: investment.theoryId,
      type: investment.type,
      amount: investment.amount,
      shares: investment.shares,
      purchasePrice: investment.purchasePrice,
      createdAt: investment.createdAt,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        res.status(404).json({
          error: "User nicht gefunden.",
        });

        return;
      }

      if (error.message === "THEORY_NOT_FOUND") {
        res.status(404).json({
          error: "Theorie nicht gefunden.",
        });

        return;
      }

      if (error.message === "INVALID_AMOUNT") {
        res.status(400).json({
          error: "Der Investment-Betrag muss größer als 0 sein.",
        });

        return;
      }

      if (error.message === "SHORT_NOT_IMPLEMENTED") {
        res.status(400).json({
          error: "SHORT-Investments sind noch nicht implementiert.",
        });

        return;
      }

      if (error.message === "INSUFFICIENT_COINS") {
        res.status(400).json({
          error: "Nicht genügend Coins.",
        });

        return;
      }

      if (error.message === "AMOUNT_TOO_LOW") {
        res.status(400).json({
          error: "Der Betrag reicht für mindestens einen Share nicht aus.",
        });

        return;
      }
    }

    console.error("Fehler beim Erstellen des Investments:", error);

    res.status(500).json({
      error: "Investment konnte nicht erstellt werden.",
    });
  }
}

export async function getUserInvestmentsController(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(req.params.id);

    const investments = await getInvestmentsByUser(userId);

    res.json(investments);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({
        error: "User nicht gefunden.",
      });

      return;
    }

    console.error("Fehler beim Abrufen der Investments:", error);

    res.status(500).json({
      error: "Investments konnten nicht abgerufen werden.",
    });
  }
}

export async function getUserPortfolioController(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(req.params.id);

    const portfolio = await getUserPortfolio(userId);

    res.json(portfolio);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({
        error: "User nicht gefunden.",
      });

      return;
    }

    console.error("Fehler beim Abrufen des Portfolios:", error);

    res.status(500).json({
      error: "Portfolio konnte nicht abgerufen werden.",
    });
  }
}