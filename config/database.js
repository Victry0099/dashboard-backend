import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { formatInTimeZone } from "date-fns-tz";
import { subMinutes } from "date-fns";

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+05:30", // Set IST timezone
  dateStrings: false,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Helper function to adjust and format time
const getAdjustedISTTime = (mysqlTime) => {
  // Convert to Date object
  const date = new Date(mysqlTime);
  // Subtract 20 minutes
  const adjustedDate = subMinutes(date, 20);
  // Format in IST
  return formatInTimeZone(
    adjustedDate,
    "Asia/Kolkata",
    "dd/MM/yyyy, hh:mm:ss aa"
  );
};

const createPool = async () => {
  try {
    const pool = mysql.createPool(config);
    const connection = await pool.getConnection();

    // Set session timezone to IST
    await connection.query("SET time_zone = '+05:30'");

    // Get current time
    const [timeResult] = await connection.query("SELECT NOW() as time");
    const currentTime = getAdjustedISTTime(timeResult[0].time);

    // console.log("Database connected successfully");
    // console.log("Current IST Time:", currentTime);

    connection.release();

    // Add time adjustment helper to pool
    pool.getAdjustedISTTime = getAdjustedISTTime;

    pool.on("error", (err) => {
      console.error("Unexpected error on idle connection", err);
      process.exit(-1);
    });

    return pool;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

let dbPool = null;

const getPool = async () => {
  if (!dbPool) {
    try {
      dbPool = await createPool();
    } catch (error) {
      console.error("Failed to create pool:", error);
      throw error;
    }
  }
  return dbPool;
};

export default await getPool();
