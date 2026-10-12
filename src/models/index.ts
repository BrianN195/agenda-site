import sequelize from "../config/database.js";
import User from "./User.js";
import Theory from "./Theory.js";
import Investment from "./Investment.js";
import Transaction from "./Transaction.js";

User.hasMany(Theory, {
  foreignKey: "createdBy",
  as: "theories",
});

Theory.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

User.hasMany(Investment, {
  foreignKey: "userId",
  as: "investments",
});

Investment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Theory.hasMany(Investment, {
  foreignKey: "theoryId",
  as: "investments",
});

Investment.belongsTo(Theory, {
  foreignKey: "theoryId",
  as: "theory",
});

User.hasMany(Transaction, {
  foreignKey: "userId",
  as: "transactions",
});

Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export {
  sequelize,
  User,
  Theory,
  Investment,
  Transaction,
};