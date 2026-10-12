"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
// import sequelize from "./config/database.js";
const index_js_1 = require("./models/index.js");
const PORT = 3000;
async function startServer() {
    try {
        await index_js_1.sequelize.authenticate();
        console.log("Datenbankverbindung erfolgreich.");
        await index_js_1.sequelize.sync();
        console.log("Datenbankmodelle synchronisiert.");
        app_js_1.default.listen(PORT, () => {
            console.log(`Server läuft auf http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Datenbankstart fehlgeschlagen:", error);
    }
}
startServer();
