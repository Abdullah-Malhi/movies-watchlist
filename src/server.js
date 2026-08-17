import express from "express";
import movieRoutes from "./Routes/movieRoutes.js";
import {config} from "dotenv";

config(); // Load environment variables from .env file


const app = express();
const PORT = 5001;

app.use('/movies', movieRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
// Middleware to parse JSON requests
app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});