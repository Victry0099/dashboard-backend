import pool from "../config/database.js";

const ensureTasksTableExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Get current time
    const [timeResult] = await pool.query("SELECT NOW() as time");
    const currentTime = pool.getAdjustedISTTime(timeResult[0].time);

    // console.log("Current IST Time:", currentTime);
    console.log("Table 'tasks' ensured successfully.");
  } catch (err) {
    console.error("Error ensuring 'tasks' table:", err);
    throw err;
  }
};

export { ensureTasksTableExists };
