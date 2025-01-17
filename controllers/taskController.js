// controllers/taskController.js
import TaskModel from "../models/TaskModel.js";
import { getIO } from "../config/socket.js";
import { successResponse, errorResponse } from "../utils/response.js";
import logger from "../utils/logger.js";

class TaskController {
  // Make sure to define getTasks method
  static async getTasks(req, res) {
    try {
      const tasks = await TaskModel.getAllTasks();
      return successResponse(res, 200, "Tasks retrieved successfully", tasks);
    } catch (error) {
      logger.error("Error in getTasks controller:", error);
      return errorResponse(res, 500, "Error retrieving tasks");
    }
  }

  static async createTask(req, res) {
    try {
      const taskId = await TaskModel.createTask(req.body);
      const task = { id: taskId, ...req.body };

      // Emit socket event
      getIO().emit("taskAdded", {
        message: "Realtime Task add successful",
        task: task,
      });

      return successResponse(res, 201, "Task created successfully", task);
    } catch (error) {
      logger.error("Error in createTask controller:", error);
      return errorResponse(res, 500, "Error creating task");
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await TaskModel.updateTask(id, status);
      if (!updated) {
        return errorResponse(res, 404, "Task not found");
      }

      // Emit socket event
      getIO().emit("taskUpdated", {
        message: "Realtime Task update successful",
        task: { id, status },
      });

      return successResponse(res, 200, "Task updated successfully");
    } catch (error) {
      logger.error("Error in updateTask controller:", error);
      return errorResponse(res, 500, "Error updating task");
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TaskModel.deleteTask(id);

      if (!deleted) {
        return errorResponse(res, 404, "Task not found");
      }

      // Emit socket event
      getIO().emit("taskDeleted", {
        message: "Realtime Task delete successful",
        taskId: id,
      });

      return successResponse(res, 200, "Task deleted successfully");
    } catch (error) {
      logger.error("Error in deleteTask controller:", error);
      return errorResponse(res, 500, "Error deleting task");
    }
  }
}

export default TaskController;
