import { prisma } from "../config/db.js";



const addToWatchlist = async (req, res) => {
    try {
        const { movieId, status, rating, notes } = req.body;

        const movie = await prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }   


        // Use findFirst instead of compound findUnique for compatibility
        const existingInMovieWatchlist = await prisma.watchlistItem.findFirst({
            where: { userId: req.user.id, movieId: movieId },
        });
        if (existingInMovieWatchlist) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }


        // const watchlistEntry = await prisma.watchlist.create({
        //     data: {
        //         movieId,
        //         status,
        //         rating,
        //         notes
        //     }
        // });
        // if (existingInMovieWatchlist) {
        //     return res.status(400).json({ message: 'Movie already in watchlist' });
        // }

        const watchlistEntry = await prisma.watchlistItem.create({
            data: {
                movieId,
                userId: req.user.id,
                status: status|| "PLANNED",
                rating,
                notes
            }
        });


        res.status(201).json({ message: 'Movie added to watchlist', watchlistEntry });
    } catch (err) {
        console.error("Add to watchlist error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};


const updateWatchlistItem = async (req, res) => {
    try {
        const { status, rating, notes } = req.body;
        const watchlistItem = await prisma.watchlistItem.findUnique({ where: { id: req.params.id } });
        if (!watchlistItem) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }

        if (watchlistItem.userId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this watchlist item' });
        }

        const updatedItem = await prisma.watchlistItem.update({
            where: { id: req.params.id },
            data: { status, rating, notes }
        });

        res.status(200).json({ message: 'Watchlist item updated', updatedItem });
    } catch (err) {
        console.error("Update watchlist item error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFromWatchlist = async (req, res) => {
    try {
        const watchlistItem = await prisma.watchlistItem.findUnique({ where: { id: req.params.movieId } });
        if (!watchlistItem) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }
        
        if (watchlistItem.userId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this watchlist item' });
        }
        await prisma.watchlistItem.delete({ where: { id: req.params.movieId } });
        res.status(200).json({ message: 'Movie removed from watchlist' });
    } catch (err) {
        console.error("Remove from watchlist error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};


export { addToWatchlist, updateWatchlistItem, removeFromWatchlist };
