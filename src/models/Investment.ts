import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Investment extends Model {
  declare id: number;
  declare userId: number;
  declare theoryId: number;
  declare type: "LONG" | "SHORT";
  declare amount: number;
  declare shares: number;
  declare purchasePrice: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Investment.init(
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

    theoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("LONG", "SHORT"),
      allowNull: false,
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    purchasePrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "investments",
    timestamps: true,
  }
);

export default Investment;