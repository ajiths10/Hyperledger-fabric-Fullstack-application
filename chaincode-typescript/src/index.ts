import { type Contract } from "fabric-contract-api";
import { AssetTransferContract } from "./assetTransfer";
import { CarGarageContract } from "./garage/cars/controller";

export { AssetTransferContract } from "./assetTransfer";
export { CarGarageContract } from "./garage/cars/controller";

export const contracts: (typeof Contract)[] = [
    AssetTransferContract,
    CarGarageContract,
];

// Multi-contract chaincodes
// IMPORTANT - You need to explicitly request the correct contract within the chaincode package
// IMPORTANT - Ref - https://github.com/hyperledger/fabric-samples/issues/1229
