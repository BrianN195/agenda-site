"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Investment = exports.Theory = exports.User = exports.sequelize = void 0;
const database_js_1 = __importDefault(require("../config/database.js"));
exports.sequelize = database_js_1.default;
const User_js_1 = __importDefault(require("./User.js"));
exports.User = User_js_1.default;
const Theory_js_1 = __importDefault(require("./Theory.js"));
exports.Theory = Theory_js_1.default;
const Investment_js_1 = __importDefault(require("./Investment.js"));
exports.Investment = Investment_js_1.default;
const Transaction_js_1 = __importDefault(require("./Transaction.js"));
exports.Transaction = Transaction_js_1.default;
User_js_1.default.hasMany(Theory_js_1.default, {
    foreignKey: "createdBy",
    as: "theories",
});
Theory_js_1.default.belongsTo(User_js_1.default, {
    foreignKey: "createdBy",
    as: "creator",
});
User_js_1.default.hasMany(Investment_js_1.default, {
    foreignKey: "userId",
    as: "investments",
});
Investment_js_1.default.belongsTo(User_js_1.default, {
    foreignKey: "userId",
    as: "user",
});
Theory_js_1.default.hasMany(Investment_js_1.default, {
    foreignKey: "theoryId",
    as: "investments",
});
Investment_js_1.default.belongsTo(Theory_js_1.default, {
    foreignKey: "theoryId",
    as: "theory",
});
User_js_1.default.hasMany(Transaction_js_1.default, {
    foreignKey: "userId",
    as: "transactions",
});
Transaction_js_1.default.belongsTo(User_js_1.default, {
    foreignKey: "userId",
    as: "user",
});
