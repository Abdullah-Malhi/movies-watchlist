import { prisma } from "../config/db.js";



const addToWatchlist = async (req, res) => {
    try {
        const { movieId, status, rating, notes } = req.body;
        // Prefer authenticated user id if available, fall back to body.userId
        const userId = req.user?.id || req.body.userId || req.body.UserId;
        const movie = await prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }   
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        // Use findFirst instead of compound findUnique for compatibility
        const existingInMovieWatchlist = await prisma.watchlistItem.findFirst({
            where: { userId: userId, movieId: movieId },
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
                userId: userId,
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

export { addToWatchlist };
