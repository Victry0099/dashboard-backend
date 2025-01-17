// // test/testDb.js
// import {
//   ensureTasksTableExists,
//   verifyTableStructure,
//   resetTasksTable,
// } from "../models/createDb.js";
// import pool from "../config/database.js";

// const verifyTableExists = async () => {
//   try {
//     const [result] = await pool.query(`
//         SELECT COUNT(*) as count
//         FROM information_schema.TABLES
//         WHERE TABLE_SCHEMA = DATABASE()
//         AND TABLE_NAME = 'tasks'
//       `);
//     return result[0].count > 0;
//   } catch (error) {
//     console.error("Error verifying table existence:", error);
//     return false;
//   }
// };

// const runAllTests = async () => {
//   console.log("=== Starting Database Tests ===");
//   try {
//     // First ensure we're connected to the right database
//     const [result] = await pool.query("SELECT DATABASE() as db");
//     console.log(`Connected to database: ${result[0].db}`);

//     // Reset database to clean state
//     console.log("\nResetting database to clean state...");
//     await resetTasksTable();
//     console.log("✓ Database reset complete");

//     // Verify table exists
//     const tableExists = await verifyTableExists();
//     if (!tableExists) {
//       throw new Error("Table was not created successfully");
//     }
//     console.log("✓ Table exists and is ready for testing");

//     // Test insertion
//     console.log("\n1. Testing task insertion...");
//     const [insertResult] = await pool.query(`
//         INSERT INTO tasks (name, status)
//         VALUES ('Test Task', 'Pending')
//       `);
//     console.log("✓ Task inserted successfully, ID:", insertResult.insertId);

//     // Verify insertion
//     const [insertedTask] = await pool.query(
//       `
//         SELECT
//           id,
//           name,
//           status,
//           created_at,
//           updated_at
//         FROM tasks
//         WHERE id = ?
//       `,
//       [insertResult.insertId]
//     );
//     console.log("✓ Inserted task:", insertedTask[0]);

//     // Cleanup
//     await pool.query("DELETE FROM tasks WHERE id = ?", [insertResult.insertId]);
//     console.log("✓ Test cleanup completed");

//     console.log("\n=== All Tests Completed Successfully ===");
//   } catch (error) {
//     console.error("\n=== Test Suite Failed ===");
//     console.error("Error:", error.message);
//   } finally {
//     try {
//       if (await verifyTableExists()) {
//         const [count] = await pool.query("SELECT COUNT(*) as count FROM tasks");
//         console.log(`Final task count: ${count[0].count}`);
//       } else {
//         console.log("Note: Tasks table does not exist in final state");
//       }
//     } catch (error) {
//       console.error("Error in final verification:", error.message);
//     }
//     process.exit();
//   }
// };

// // Run all tests
// runAllTests();

// test/testTimezone.js
import TaskModel from "../models/TaskModel.js";
import pool from "../config/database.js";

const testTimezoneHandling = async () => {
  try {
    console.log("=== Testing Timezone Handling ===");

    // Check database timezone settings
    const [timeZoneSettings] = await pool.query(`
      SELECT 
        @@global.time_zone as global_tz,
        @@session.time_zone as session_tz,
        @@system_time_zone as system_tz
    `);
    console.log("Timezone settings:", timeZoneSettings[0]);

    // Check current times
    const timeCheck = await TaskModel.verifyTimeConversion();
    console.log("Time conversion check:", timeCheck);

    // Create a test task
    const newTask = await TaskModel.createTask({
      name: "Timezone Test Task",
      status: "Pending",
    });
    console.log("Created task:", newTask);

    // Verify the created task's timestamp
    const tasks = await TaskModel.getAllTasks();
    console.log("Retrieved tasks:", tasks[0]);

    // Cleanup
    await TaskModel.deleteTask(newTask.id);
    console.log("Test completed successfully");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    process.exit();
  }
};

testTimezoneHandling();
