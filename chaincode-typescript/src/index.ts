import { type Contract } from "fabric-contract-api";
import { AssetTransferContract } from "./assetTransfer";
import { CarGarageContract } from "./garage/cars/controller";

export const contracts: (typeof Contract)[] = [
  AssetTransferContract,
  CarGarageContract,
];
