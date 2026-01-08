import { verifyToken } from "../utils/jwt.mjs";
import { ApiError } from "../utils/apiError.mjs";

export const protect = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;

  if (!header) return next(new ApiError(401, "Authorization header missing"));

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Invalid authorization format"));
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) return next(new ApiError(401, "Invalid or expired token"));

    req.user = decoded;
    return next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
