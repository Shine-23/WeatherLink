import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            username: user.username, 
            email: user.email 
        },
        secretKey,
        {
            expiresIn: '1d'
        }
    );
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        console.error(`[Error] Token Verification: ${err.message}`);
        return null; 
    }
}