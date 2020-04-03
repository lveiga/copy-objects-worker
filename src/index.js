const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const Config = require('./config');
const Logger = require('./logger');
const Service = require('./service');

const logger = new Logger(module);

AWS.config.update({
  region: Config.awsRegion,
  accessKeyId: Config.awsCount,
  secretAccessKey: Config.awsSecretKey,
});

const handleMessage = async message => {
  const jsonMessage = JSON.parse(message.Body);
  const result = await Service.processFile(jsonMessage);
  logger.info(JSON.stringify(result));
};

const app = Consumer.create({
  queueUrl: Config.awsSqsUrl,
  handleMessage,
  sqs: new AWS.SQS(),
});

app.on('error', err => {
  logger.error(err.message);
});

app.on('processing_error', err => {
  logger.error(err.message);
});

app.on('timeout_error', err => {
  logger.error(err.message);
});

app.start();
