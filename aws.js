

const axios = require("axios");
const AWS = require("aws-sdk");
const { PassThrough } = require("stream");
const { puppetToBuffer } = require('./puppet')

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET,
  region: process.env.REGION,
});

const bucket=process.env.BUCKET_NAME;

const CSPToS3 = async (url, folder) => {
    try {
      const buffer = await puppetToBuffer(url)
      const filename = url.substring(url.lastIndexOf('/')+1);
      const response = await s3.upload({ Bucket: bucket, Key: folder+filename, Body: buffer}).promise();
      console.log(response.Location)
      return response.Location
    } catch (error) {
      console.error(error);
    }
  };
module.exports = {CSPToS3}