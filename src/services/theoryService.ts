import { Theory, User } from "../models/index.js";

interface CreateTheoryData {
  title: string;
  description: string;
  createdBy: number;
}

export async function createTheory(data: CreateTheoryData) {
  const user = await User.findByPk(data.createdBy);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const theory = await Theory.create({
    title: data.title,
    description: data.description,
    createdBy: data.createdBy,
    status: "ACTIVE",
    currentValue: 100,
    peakValue: 100,
  });

  return theory;
}

export async function getTheories() {
  return Theory.findAll({
    order: [["createdAt", "DESC"]],
  });
}

export async function getTheoryById(theoryId: number) {
  return Theory.findByPk(theoryId, {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "username"],
      },
    ],
  });
}

export async function updateTheoryStatus(
  theoryId: number,
  status: Theory["status"]
) {
  const theory = await Theory.findByPk(theoryId);

  if (!theory) {
    throw new Error("THEORY_NOT_FOUND");
  }

  const validStatuses: Theory["status"][] = [
    "ACTIVE",
    "CONFIRMED",
    "DISPROVEN",
    "DORMANT",
    "REVIVED",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("INVALID_STATUS");
  }

  const allowedTransitions: Record<
    Theory["status"],
    Theory["status"][]
  > = {
    ACTIVE: ["CONFIRMED", "DISPROVEN", "DORMANT"],
    CONFIRMED: ["DISPROVEN"],
    DISPROVEN: ["REVIVED"],
    DORMANT: ["ACTIVE", "CONFIRMED", "DISPROVEN"],
    REVIVED: ["ACTIVE", "CONFIRMED", "DISPROVEN"],
  };

  if (!allowedTransitions[theory.status].includes(status)) {
    throw new Error("INVALID_STATUS_TRANSITION");
  }

  if (status === "DISPROVEN") {
    theory.currentValue = 0;
  }

  if (status === "REVIVED") {
    theory.currentValue = Math.floor(theory.peakValue * 0.25);
  }

  theory.status = status;

  await theory.save();

  return theory;
}
