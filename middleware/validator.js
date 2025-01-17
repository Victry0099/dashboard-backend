import Joi from "joi";
import { AppError } from "../middleware/errroHandler.js";

// Validation schemas
const schemas = {
  task: Joi.object({
    name: Joi.string().trim().min(1).max(255).required().messages({
      "string.empty": "Task name cannot be empty",
      "string.min": "Task name must be at least 1 character long",
      "string.max": "Task name cannot exceed 255 characters",
      "any.required": "Task name is required",
    }),

    status: Joi.string()
      .valid("Pending", "In Progress", "Completed")
      .default("Pending")
      .messages({
        "any.only": "Status must be one of: Pending, In Progress, Completed",
      }),
  }),

  taskUpdate: Joi.object({
    status: Joi.string()
      .valid("Pending", "In Progress", "Completed")
      .required()
      .messages({
        "any.required": "Status is required",
        "any.only": "Status must be one of: Pending, In Progress, Completed",
      }),
  }),

  // Add more schemas as needed
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");

      throw new AppError(errorMessage, 400);
    }

    next();
  };
};

// Specific validation middlewares
export const validateTask = validate(schemas.task);
export const validateTaskUpdate = validate(schemas.taskUpdate);

// Custom field validators
export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    throw new AppError("Invalid ID format", 400);
  }

  req.params.id = id;
  next();
};

// Request sanitizer
export const sanitizeRequest = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

// Custom validation helpers
export const validation = {
  isValidStatus: (status) => {
    return ["Pending", "In Progress", "Completed"].includes(status);
  },

  isValidTaskName: (name) => {
    return (
      typeof name === "string" &&
      name.trim().length > 0 &&
      name.trim().length <= 255
    );
  },

  sanitizeString: (str) => {
    return str ? str.trim() : "";
  },
};

// Export schemas for reuse
export const validationSchemas = schemas;
