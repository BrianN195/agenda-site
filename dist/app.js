"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const theoryRoutes_js_1 = __importDefault(require("./routes/theoryRoutes.js"));
const investmentRoutes_js_1 = __importDefault(require("./routes/investmentRoutes.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({
        message: "Agenda-Site Backend läuft!",
    });
});
app.use("/api/users", userRoutes_js_1.default);
app.use("/api/theories", theoryRoutes_js_1.default);
app.use("/api/investments", investmentRoutes_js_1.default);
exports.default = app;
