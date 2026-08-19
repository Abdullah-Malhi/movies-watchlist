import { prisma } from "@prisma/client";


import generateToken from "../utils/generateToken.js";



const register = async (req, res) => {
    const {name,  email, password } =req.body;

    const userExists = await prisma.user.findUnique({
        where: {
            email: email,
        },
    }); 

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Here you would typically create the user in the database
    const newUser = await prisma.user.create({ data: { name, email, password: hashedPassword } });      

    const token = generateToken(newUser.id, res);

    res.status(201).json({ message: 'User registered successfully', user: newUser, token });
}


const login = async (req, res) => {
    const { email, password } = req.body;  
    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!userExists) {
        return res.status(400).json({ message: 'User does not exist' });
    }
    //verify password
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }  

    const token = generateToken(userExists.id, res);


    res.status(201).json({ message: 'User logged in successfully', user: userExists, token });
};


const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true, 
        expires: new Date(0)
        });
    res.status(200).json({ message: "Logged out successfully" });
}


export { register, login, logout };