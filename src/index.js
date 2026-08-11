import express from "express";

import {config} from './config/index.js';
import connectDB from './config/db.js';

import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send(`ShipNow API v1 - corriendo en ${config.NODE_ENV} mode`);
});

connectDB();

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

