import express from "express";
import userRoutes from "./routes/userRoutes.js";
import theoryRoutes from "./routes/theoryRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Agenda-Site Backend läuft!",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/theories", theoryRoutes);
app.use("/api/investments", investmentRoutes);

export default app;