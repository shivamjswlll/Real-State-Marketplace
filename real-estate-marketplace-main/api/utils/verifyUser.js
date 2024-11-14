import jwt from 'jsonwebtoken';
import customError from './error.js';

const verifyUser = async (req, res, next) => {
    if(!req.cookies) return next(customError(401,"cookie not found"));
    const token = req.cookies.access_token;
    if(!token) return next(customError(401, "Unauthorised"));
    await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (err, user) => {
        if(err) return customError(403, "Forbidden");
        req.user = user;
        next();
      }
    );
}

export default verifyUser;
