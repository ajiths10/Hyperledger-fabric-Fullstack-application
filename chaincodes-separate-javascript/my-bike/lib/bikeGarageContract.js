"use strict";

// Deterministic JSON.stringify()
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class BikeGarageContract extends Contract {
  constructor() {
    //Unique smart contract name when multiple contracts per chaincode
    super("BikeGarageContract");
  }

  async InitGarageBikeLedger(ctx) {
    const assets = [
      {
        ID: "assetbike1",
        Model: "Harley-Davidson Sportster Iron 883",
        Color: "Black",
        Owner: "John",
        Year: 2022,
        VIN: "XY34EF567891",
        EngineType: "V-Twin",
        Mileage: 500,
      },
      {
        ID: "assetbike2",
        Model: "Honda CB300R",
        Color: "Red",
        Owner: "Sarah",
        Year: 2020,
        VIN: "XY34EF567892",
        EngineType: "Single-cylinder",
        Mileage: 800,
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
  async GetAllGarageBikes(ctx) {
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

module.exports = BikeGarageContract;
