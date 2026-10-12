import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare passwordHash: string;
  declare coins: number;
  declare lastWeeklyReward: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
    },

    lastWeeklyReward: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;