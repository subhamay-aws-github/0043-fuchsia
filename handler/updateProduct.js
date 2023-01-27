const AWS = require("aws-sdk");
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");
const util = require("../util.js");

module.exports.updateProduct = async (event, context) => {
  try {
    const timestamp = new Date().toISOString();
    const body = JSON.parse(event.body);
    body.UpdatedAt = timestamp;
    console.log(JSON.stringify(body));

    let getData = await dynamoDb
      .get({
        TableName: PRODUCTS_TABLE,
        Key: {
          Id: Number(body.Id),
        },
      })
      .promise();

    try {
      body.CreatedAt = getData.Item.CreatedAt;
      body.UpdatedAt = timestamp;
      console.log(JSON.stringify(body));

      if (typeof body.Id != "number") {
        console.error("Validation Failed - Id should be of type number");
      }

      let deleteData = await dynamoDb.delete({
        TableName: PRODUCTS_TABLE,
        Key: {
          Id: Number(body.Id)
        }
      }).promise();


      let putData = await dynamoDb.put({
        TableName: PRODUCTS_TABLE,
        Item: body,
      }).promise();

      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(putData),
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
