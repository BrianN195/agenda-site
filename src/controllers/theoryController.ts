import { Request, Response } from "express";
import {
  createTheory,
  getTheories,
  getTheoryById,
  updateTheoryStatus,
} from "../services/theoryService.js";

export async function createTheoryController(req: Request, res: Response) {
  try {
    const { title, description, createdBy } = req.body;

    const theory = await createTheory({
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
  } catch (error) {
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

export async function getTheoriesController(_req: Request, res: Response) {
  try {
    const theories = await getTheories();

    res.json(theories);
  } catch (error) {
    console.error("Fehler beim Abrufen der Theorien:", error);

    res.status(500).json({
      error: "Theorien konnten nicht abgerufen werden.",
    });
  }
}

export async function getTheoryByIdController(req: Request, res: Response) {
  try {
    const theoryId = Number(req.params.id);

    const theory = await getTheoryById(theoryId);

    if (!theory) {
      res.status(404).json({
        error: "Theorie nicht gefunden.",
      });

      return;
    }

    res.json(theory);
  } catch (error) {
    console.error("Fehler beim Abrufen der Theorie:", error);

    res.status(500).json({
      error: "Theorie konnte nicht abgerufen werden.",
    });
  }
}

export async function updateTheoryStatusController(
  req: Request,
  res: Response,
) {
  try {
    const theoryId = Number(req.params.id);
    const { status } = req.body;

    const theory = await updateTheoryStatus(theoryId, status);

    res.json({
      id: theory.id,
      title: theory.title,
      status: theory.status,
      currentValue: theory.currentValue,
      peakValue: theory.peakValue,
    });
  } catch (error) {
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

      if (error.message === "INVALID_STATUS_TRANSITION") {
        res.status(400).json({
          error: "Dieser Statuswechsel ist nicht erlaubt.",
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
