import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            username: user.username, 
            email: user.email 
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.error(`[Error] Token Verification: ${err.message}`);
        return null; 
    }
}