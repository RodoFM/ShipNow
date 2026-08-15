import express from "express";

import {config} from './config/env.config.js';
import {connectDB} from './config/db.js';

import userRoutes from "./routes/user.routes.js";

import productRoutes from './routes/products.routes.js';
import mockRoutes from './routes/mocks.routes.js';

const app = express();

app.use(express.json());

//Rutas  
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/mocks', mockRoutes);

app.get("/", (req, res) => {
    res.send(`ShipNow API v1 - corriendo en ${config.NODE_ENV} mode`);
});

connectDB();

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

