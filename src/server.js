import express from "express";
import movieRoutes from "./Routes/movieRoutes.js";
import authRoutes from "./Routes/authRotues.js";
import {config} from "dotenv";
import {connectDB, disconnectDB} from "./config/db.js";

config(); // Load environment variables from .env file


const app = express();
const PORT = 5001;

app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
// Middleware to parse JSON requests
app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });     
});

process.on("uncaughtException", (err) => {  
    console.error("Uncaught Exception:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

process.on("SIGTERM", async () => {
    console.log("SIGTERM received: closing server");  
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});