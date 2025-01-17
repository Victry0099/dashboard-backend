// app.js
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { corsOptions } from "./config/cors.js";
import { setupSecurity } from "./middleware/security.js";
import { errorHandler } from "./middleware/errroHandler.js";
import TaskRoute from "./routes/taskRoutes.js";
import { initSocket } from "./config/socket.js";
import { ensureTasksTableExists } from "./models/createDb.js";

const app = express();
const server = createServer(app);

//create table if not extists
ensureTasksTableExists();
// reset database

// Middleware
app.options(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
setupSecurity(app);

// Routes
app.use("/api", TaskRoute);

// Error handling
app.use(errorHandler);

// Socket.io
initSocket(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
