
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { createServer } = require('http');
const { createSocket } = require('./utils/socket');
const connectToMongoDB = require('./database/mongo.database');
let server;
const httpServer = createServer(app);

//Create socket server
createSocket(httpServer);

//Connect to mongodb
connectToMongoDB();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

server = httpServer.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});