import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'Access denied. User not found.' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    } 
};

export { authMiddleware };