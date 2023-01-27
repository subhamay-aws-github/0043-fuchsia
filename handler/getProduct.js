const AWS = require("aws-sdk");
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const util = require("../util.js");

module.exports.getProduct = async (event, context) => {
    try {
      console.log(event.pathParameters.Id);

      const params = {
        TableName: PRODUCTS_TABLE,
        Key: {
          Id: Number(event.pathParameters.Id)
        }
      };
      console.log(params);
      let data = await dynamoDb.get(params).promise();
      
      const response = data.Item
      ?  {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(data.Item)
      } : {
        statusCode: 404,
        headers: util.getResponseHeaders(),
        body: JSON.stringify({message: "Product not found !"})
      };

      return response;

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