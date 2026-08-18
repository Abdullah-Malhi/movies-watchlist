import { prisma } from "@prisma/client";






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

    res.status(201).json({ message: 'User registered successfully', user: newUser });
}


const login = async (req, res) => {
    const { email, password } = req.body;  
    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            email: email,a=
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
    res.status(201).json({ message: 'User logged in successfully', user: userExists });
};



export { register, login };