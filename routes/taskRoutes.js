// routes/taskRoutes.js
import { Router } from "express";
import TaskController from "../controllers/taskController.js";
import {
  validateTask,
  validateTaskUpdate,
  validateId,
  sanitizeRequest,
} from "../middleware/validator.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Make sure TaskController methods exist and are properly exported
router.get("/tasks", TaskController.getTasks); // Check if getTasks exists

router.post(
  "/tasks",
  [apiLimiter, sanitizeRequest, validateTask],
  TaskController.createTask
);

router.put(
  "/tasks/:id",
  [apiLimiter, validateId, sanitizeRequest, validateTaskUpdate],
  TaskController.updateTask
);

router.delete("/tasks/:id", validateId, TaskController.deleteTask);

export default router;
