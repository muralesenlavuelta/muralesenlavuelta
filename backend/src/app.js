import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import muralRoutes from "./routes/muralRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import keywordRoutes from "./routes/keywordRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import muralImageRoutes from "./routes/muralImageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import muralLikeRoutes from "./routes/muralLikeRoutes.js";
import voterTokenRoutes from "./routes/voterTokenRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import muralAlertRoutes from "./routes/muralAlertRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Servidor funcionando correctamente."
    });
});

app.use("/api/murals", muralRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/keywords", keywordRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/murals", muralImageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/voter-token", voterTokenRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/alerts", muralAlertRoutes);

export default app;