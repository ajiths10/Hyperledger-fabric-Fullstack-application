"use strict";

// Deterministic JSON.stringify()
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class CarGarageContract extends Contract {
  constructor() {
    //Unique smart contract name when multiple contracts per chaincode
    super("CarGarageContract");
  }

  async InitGarageCarLedger(ctx) {
    const assets = [
      {
        ID: "assetcar1",
        Model: "Honda Accord",
        Color: "Silver",
        Owner: "Ajith",
        Year: 2023,
        VIN: "AB12CD345671",
        EngineType: "4-cylinder Diesel",
        Mileage: 10,
      },
      {
        ID: "assetcar2",
        Model: "Toyota Camry",
        Color: "White",
        Owner: "Emma",
        Year: 2019,
        VIN: "AB12CD345678",
        EngineType: "6-cylinder Petrol",
        Mileage: 11,
      },
    ];

    for (const asset of assets) {
      // asset.docType = 'asset';
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(
        asset.ID,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      );
    }
  }

  // GetAllGarageCars returns all assets found in the world state.
  async GetAllGarageCars(ctx) {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = CarGarageContract;
