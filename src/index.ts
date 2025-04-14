import { startServer } from "./server";
import logger from "./lib/utils/logger";

logger.info("Starting server...");

startServer()
  .then(() => {
    logger.info("Server started successfully");
  })
  .catch((error) => {
    logger.error("Failed to start server:", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });
