const AWS = require("aws-sdk");

const ACCESS_KEY = "AKIAQYQN2G66FT7IGQ2R";
const SECRET_KEY = "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";
const S3_BUCKET = "ubereats-273";

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: "us-west-1",
});

const s3 = new AWS.S3();

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: "public-read",
    Body: buffer,
    Bucket: S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`,
  };
  return s3.upload(params).promise();
};

module.exports = {
  s3,
  uploadFile,
};
