const AWS = require("aws-sdk");
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const util = require("../util.js");

module.exports.listProducts = async (event, context) => {
    try {
      const params = {
        TableName: PRODUCTS_TABLE
      };
      let data = await dynamoDb.scan(params).promise();
  
      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(data.Items),
      };
    } catch (err) {
      console.log("Error", err);
      return {
        statusCode: err.statusCode ? err.statusCode : 500,
        headers: util.getResponseHeaders(),
        body: JSON.stringify({
          error: err.name ? err.name : "Exception",
          message: err.message ? err.message : "Unknown error",
        }),
      };
    }
  };