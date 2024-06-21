/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const assetTransfer = require("./lib/assetTransfer");
const carGarageContract = require("./lib/garage/cars/controller");

module.exports.assetTransfer = assetTransfer;
module.exports.carGarageContract = carGarageContract;
module.exports.contracts = [assetTransfer, carGarageContract];
