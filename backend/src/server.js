import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js";

import "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("Base de datos conectada correctamente.");

        await sequelize.sync();

        console.log("Modelos sincronizados correctamente.");

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("No se pudo iniciar el servidor.");
        console.error(error);
        process.exit(1);
    }
}

startServer();