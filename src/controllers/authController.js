import bcrypt from "bcryptjs";
import {generateToken} from "../utils/generateToken.js";
import { prisma } from "../config/db.js";



const register = async (req, res) => {
    try {
        const {name,  email, password } = req.body;

        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const newUser = await prisma.user.create({ data: { name, email, password: hashedPassword } });

        const token = generateToken(newUser.id, res);

        res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: 'Server error' });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;  
        // Check if user exists
        const userExists = await prisma.user.findUnique({ where: { email } });

        if (!userExists) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // verify password
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }  

        const token = generateToken(userExists.id, res);

        res.status(200).json({ message: 'User logged in successfully', user: userExists, token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};


const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true, 
        expires: new Date(0)
        });
    res.status(200).json({ message: "Logged out successfully" });
}


export { register, login, logout };