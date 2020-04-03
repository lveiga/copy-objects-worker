const dotenv = require('dotenv');

dotenv.config();

module.exports = Object.freeze({
  port: process.env.PORT || 3001,
  awsCount: process.env.awsCount,
  awsRegion: process.env.awsRegion,
  awsSecretKey: process.env.awsSecretKey,
  awsBucketName: process.env.awsBucketName,
  awsSqsUrl: process.env.awsSqsUrl
});
