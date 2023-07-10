import jwt from 'jsonwebtoken';


const Secret = 'layerE#Copilot@';

export const generateToken = (user) => {
    return jwt.sign(user, Secret);
}

export const verifyToken = (token) => {
    return jwt.verify(token, Secret);
}