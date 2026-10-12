import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Transaction extends Model {
  declare id: number;
  declare userId: number;
  declare type:
    | "WEEKLY_REWARD"
    | "INVESTMENT"
    | "PAYOUT"
    | "REFUND"
    | "ADJUSTMENT";
  declare amount: number;
  declare balanceAfter: number;
  declare description: string;
  declare createdAt: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "WEEKLY_REWARD",
        "INVESTMENT",
        "PAYOUT",
        "REFUND",
        "ADJUSTMENT"
      ),
      allowNull: false,
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    balanceAfter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
    updatedAt: false,
  }
);

export default Transaction;