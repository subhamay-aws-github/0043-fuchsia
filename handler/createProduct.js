const AWS = require("aws-sdk");
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");
const util = require("../util.js");

module.exports.createProduct = async (event, context) => {
  try {
    const timestamp = new Date().toISOString();
    const body = JSON.parse(event.body);
    body.CreatedAt = timestamp;
    body.UpdatedAt = timestamp;
    console.log(JSON.stringify(body));

    if (typeof body.Id != "number") {
      console.error("Validation Failed - Id should be of type number");
    }

    const params = {
      TableName: PRODUCTS_TABLE,
      Item: body,
    };
    let data = await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data.Item),
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
