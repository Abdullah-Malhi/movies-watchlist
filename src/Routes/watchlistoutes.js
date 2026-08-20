import express from "express";
import { addToWatchlist } from "../controllers/watchlistController.js";
import { removeFromWatchlist } from "../controllers/watchlistController.js";
import { updateWatchlistItem } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();
// router.use(authMiddleware); // Apply authentication middleware to all routes in this router

router.post('/', authMiddleware, addToWatchlist);
router.put("/:id", authMiddleware, updateWatchlistItem); // Update watchlist item

router.delete('/:movieId', authMiddleware, removeFromWatchlist);


export default router;
 
