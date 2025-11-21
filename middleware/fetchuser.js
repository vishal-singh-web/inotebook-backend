 import pkg from 'jsonwebtoken';
const { verify } = pkg;
import dotenv from 'dotenv';
dotenv.config(); 
const JWT_SIGN = process.env.JWT_SIGN;

const fetchuser = (req, res, next) => {
    const token = req.header('authtoken');
    if (!token) {
        return res.status(401).send({ error: "please authenticate using a valid token." })
    }
    try {
        var decoded = verify(token, JWT_SIGN);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "please authenticate using a valid tokens." })
    }

}

export default fetchuser;