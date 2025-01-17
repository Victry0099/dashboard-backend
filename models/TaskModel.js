import pool from "../config/database.js";
import logger from "../utils/logger.js";

class TaskModel {
  static async getAllTasks() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          id,
          name,
          status,
          created_at
        FROM tasks 
        ORDER BY created_at DESC
      `);

      return rows.map((task) => ({
        ...task,
        created_at: pool.getAdjustedISTTime(task.created_at),
      }));
    } catch (error) {
      logger.error("Error in getAllTasks:", error);
      throw error;
    }
  }

  static async createTask({ name, status }) {
    try {
      const [result] = await pool.query(
        "INSERT INTO tasks (name, status) VALUES (?, ?)",
        [name, status || "Pending"]
      );

      const [newTask] = await pool.query(
        `SELECT 
          id,
          name,
          status,
          created_at
        FROM tasks 
        WHERE id = ?`,
        [result.insertId]
      );

      return {
        ...newTask[0],
        created_at: pool.getAdjustedISTTime(newTask[0].created_at),
      };
    } catch (error) {
      logger.error("Error in createTask:", error);
      throw error;
    }
  }

  static async updateTask(id, status) {
    try {
      const [result] = await pool.query(
        "UPDATE tasks SET status = ? WHERE id = ?",
        [status, id]
      );

      if (result.affectedRows > 0) {
        const [updatedTask] = await pool.query(
          `SELECT 
            id,
            name,
            status,
            created_at
          FROM tasks 
          WHERE id = ?`,
          [id]
        );

        return {
          ...updatedTask[0],
          created_at: pool.getAdjustedISTTime(updatedTask[0].created_at),
        };
      }
      return null;
    } catch (error) {
      logger.error("Error in updateTask:", error);
      throw error;
    }
  }

  static async deleteTask(id) {
    try {
      const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error("Error in deleteTask:", error);
      throw error;
    }
  }

  static async getTaskById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          id,
          name,
          status,
          created_at
        FROM tasks 
        WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return {
        ...rows[0],
        created_at: pool.getAdjustedISTTime(rows[0].created_at),
      };
    } catch (error) {
      logger.error("Error in getTaskById:", error);
      throw error;
    }
  }
}

export default TaskModel;
