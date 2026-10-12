import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Theory extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare status: "ACTIVE" | "CONFIRMED" | "DISPROVEN" | "DORMANT" | "REVIVED";
  declare currentValue: number;
  declare peakValue: number;
  declare createdBy: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Theory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "CONFIRMED",
        "DISPROVEN",
        "DORMANT",
        "REVIVED"
      ),
      allowNull: false,
      defaultValue: "ACTIVE",
    },

    currentValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },

    peakValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "theories",
    timestamps: true,
  }
);

export default Theory;