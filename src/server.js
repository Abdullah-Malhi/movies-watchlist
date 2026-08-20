import express from "express";
import movieRoutes from "./Routes/movieRoutes.js";
import authRoutes from "./Routes/authRotues.js";
import watchlistRoutes from "./Routes/watchlistoutes.js";
import {config} from "dotenv";
import {connectDB, disconnectDB} from "./config/db.js";

config(); // Load environment variables from .env file
connectDB(); // Connect to the database

const app = express();
const PORT = process.env.PORT || 5001;

// Body parser middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);
app.use('/watchlist', watchlistRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
 
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