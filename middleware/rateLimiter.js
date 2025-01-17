import rateLimit from "express-rate-limit";
import { AppError } from "./errroHandler.js";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    throw new AppError(
      "Too many requests from this IP, please try again later.",
      429
    );
  },
});

// More strict rate limiter for sensitive routes
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    throw new AppError("Too many attempts, please try again later.", 429);
  },
});

// Custom rate limiter factory
export const createRateLimiter = ({ windowMs, max, message }) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      throw new AppError(message || "Too many requests", 429);
    },
  });
};
