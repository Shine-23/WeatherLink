import { User } from "../models/Users.mjs";
import { generateToken } from "../utils/jwt.mjs";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try{
        const { username, email, password } = req.body;
    
        if(!username || !email || !password){
            return res.status(400).json({ message: 'Please provide all required fields' }); 
        }

        const existingUser = await User.findOne({email}); 
        if(existingUser){
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        const token = generateToken(newUser);
        res.status(201).json({token, user: {id: newUser._id, username, email}});
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'User Not Found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = generateToken(user);
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } }); 


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


export const googleCallback = async (req, res) => {
  try {
    const user = req.user; 
    const token = generateToken(user);

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google auth failed' });
  }
};