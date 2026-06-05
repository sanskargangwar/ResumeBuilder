
// controller for user regsitration
//POST : /api/users/register
import User from "../Models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../Models/Resume.js";
const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}
export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // check fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        // check existing user
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // generate token
        const token = generateToken(newUser._id);

        // remove password
        newUser.password = undefined;

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: newUser,
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        });
    }
};

// controller for user login
// POST: /api/users/login

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // generate token
        const token = generateToken(user._id);

        // remove password
        user.password = undefined;

        return res.status(200).json({
            message: "Login successfully",
            token,
            user,
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        });
    }
}

// controller for getting user by id
//GET: /api/users/data

export const getUserById = async (req, res) => {

    try {

        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        });
    }
}



// controller for getting user resumes
// GET: /api/users/resumes


export const getUserResumes = async (req,res)=>{
    try {
        const userId = req.userId;

        // return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}