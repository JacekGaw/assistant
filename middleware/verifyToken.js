import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No access token was presented" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Access token is invalid" });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
