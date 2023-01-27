const AWS = require("aws-sdk");
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const util = require("../util.js");

module.exports.deleteProduct = async (event, context) => {
    try {
      console.log("Id = ", event.pathParameters.Id);
      
      const params = {
        TableName: PRODUCTS_TABLE,
        Key: {
          Id: Number(event.pathParameters.Id)
        }
      };
      console.log(params);
      let data = await dynamoDb.delete(params).promise();
      
      return  {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify({data: "Deletion successfull!"})
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