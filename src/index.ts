import app from "./app.js";
// import sequelize from "./config/database.js";
import { sequelize } from "./models/index.js";

const PORT = 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Datenbankverbindung erfolgreich.");

    await sequelize.sync();

    console.log("Datenbankmodelle synchronisiert.");

    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Datenbankstart fehlgeschlagen:", error);
  }
}

startServer();