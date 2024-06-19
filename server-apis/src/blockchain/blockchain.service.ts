import { Injectable, OnModuleInit } from "@nestjs/common";
import { CreateBlockchainDto } from "./dto/create-blockchain.dto";
import { UpdateBlockchainDto } from "./dto/update-blockchain.dto";

import * as grpc from "@grpc/grpc-js";
import {
  connect,
  Contract,
  Identity,
  Signer,
  signers,
} from "@hyperledger/fabric-gateway";
import * as crypto from "crypto";
import { promises as fs } from "fs";
import * as path from "path";
import { TextDecoder } from "util";
import { UpdateAssetOwnerBlockchainDto } from "./dto/update-asset-owner-blockchain.dto";

@Injectable()
export class BlockchainService {
  channelName: string;
  chaincodeName: string;
  mspId: string;
  cryptoPath: string;
  keyDirectoryPath: string;
  certDirectoryPath: string;
  tlsCertPath: string;
  peerEndpoint: string;
  peerHostAlias: string;
  Contract: Contract;

  constructor() {
    this.channelName = "mychannel";
    this.chaincodeName = envOrDefault("CHAINCODE_NAME", "basic");
    this.mspId = envOrDefault("MSP_ID", "Org1MSP");

    // Path to crypto materials.
    this.cryptoPath = envOrDefault(
      "CRYPTO_PATH",
      path.resolve(
        "/home/ajiths/Desktop/Growcoms/blockchain/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com"
      )
    );

    // Path to user private key directory.
    this.keyDirectoryPath = envOrDefault(
      "KEY_DIRECTORY_PATH",
      path.resolve(
        this.cryptoPath,
        "users",
        "User1@org1.example.com",
        "msp",
        "keystore"
      )
    );

    // Path to user certificate directory.
    this.certDirectoryPath = envOrDefault(
      "CERT_DIRECTORY_PATH",
      path.resolve(
        this.cryptoPath,
        "users",
        "User1@org1.example.com",
        "msp",
        "signcerts"
      )
    );

    // Path to peer tls certificate.
    this.tlsCertPath = envOrDefault(
      "TLS_CERT_PATH",
      path.resolve(
        this.cryptoPath,
        "peers",
        "peer0.org1.example.com",
        "tls",
        "ca.crt"
      )
    );

    // Gateway peer endpoint.
    this.peerEndpoint = envOrDefault("PEER_ENDPOINT", "localhost:7051");

    // Gateway peer SSL host name override.
    this.peerHostAlias = envOrDefault(
      "PEER_HOST_ALIAS",
      "peer0.org1.example.com"
    );

    /**
     * displayInputParameters() will print the global scope parameters used by the main driver routine.
     */
    console.log(`channelName:       ${this.channelName}`);
    console.log(`chaincodeName:     ${this.chaincodeName}`);
    console.log(`mspId:             ${this.mspId}`);
    console.log(`cryptoPath:        ${this.cryptoPath}`);
    console.log(`keyDirectoryPath:  ${this.keyDirectoryPath}`);
    console.log(`certDirectoryPath: ${this.certDirectoryPath}`);
    console.log(`tlsCertPath:       ${this.tlsCertPath}`);
    console.log(`peerEndpoint:      ${this.peerEndpoint}`);
    console.log(`peerHostAlias:     ${this.peerHostAlias}`);
  }

  async onModuleInit() {
    // This is where you perform your asynchronous initialization
    this.Contract = await this.loadData();
  }

  private async loadData() {
    try {
      // The gRPC client connection should be shared by all Gateway connections to this endpoint.
      const client = await this.newGrpcConnection();

      const gateway = connect({
        client,
        identity: await this.newIdentity(),
        signer: await this.newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
          return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
          return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
          return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
          return { deadline: Date.now() + 60000 }; // 1 minute
        },
      });

      // Get a network instance representing the channel where the smart contract is deployed.
      const network = gateway.getNetwork(this.channelName);

      // Get the smart contract from the network.
      const contract = network.getContract(this.chaincodeName);
      return contract;
    } catch (error) {
      console.error("******** FAILED to run the application:", error);
      process.exitCode = 1;
    }
  }

  /**
   * Submit a transaction synchronously, blocking until it has been committed to the ledger.
   */
  async create(createBlockchainDto: CreateBlockchainDto) {
    console.log(
      "\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments"
    );
    const assetId = `asset${Date.now()}`;

    try {
      // Create a new asset on the ledger.
      await this.Contract.submitTransaction(
        "CreateAsset",
        assetId,
        createBlockchainDto.Color,
        createBlockchainDto.Size,
        createBlockchainDto.Owner,
        createBlockchainDto.AppraisedValue
      );
    } catch (error) {
      console.error("******** FAILED to run the application:", error);
      return error;
      //  process.exitCode = 1;
    }

    return "*** Transaction committed successfully";
  }

  // Return all the current assets on the ledger.
  async findAll() {
    let data = await this.getAllAssets(this.Contract);
    return data;
  }

  // Get the asset details by assetID.
  async findOne(assetId: string) {
    console.log(
      "\n--> Evaluate Transaction: ReadAsset, function returns asset attributes"
    );

    const resultBytes = await this.Contract.evaluateTransaction(
      "ReadAsset",
      assetId
    );
    const utf8Decoder = new TextDecoder();
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log("*** Result:", result);

    return result;
  }

  update(id: number, updateBlockchainDto: UpdateBlockchainDto) {
    return `This action updates a #${id} blockchain`;
  }

  remove(id: number) {
    return `This action removes a #${id} blockchain`;
  }

  // Update an existing asset owner asynchronously.
  async updateAssetOwner(
    assetId: string,
    payload: UpdateAssetOwnerBlockchainDto
  ) {
    let res = await this.transferAssetAsync(this.Contract, assetId, "Ajith");
    return {
      message: `This action updates a #${assetId} blockchain`,
      data: res,
    };
  }

  /**
   * Evaluate a transaction to query ledger state.
   */
  async getAllAssets(contract: Contract): Promise<void> {
    console.log(
      "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
    );

    const resultBytes = await contract.evaluateTransaction("GetAllAssets");
    const utf8Decoder = new TextDecoder();
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log("*** Result:", result);
    return result;
  }

  /**
   * This type of transaction would typically only be run once by an application the first time it was started after its
   * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
   */
  async initLedger(): Promise<Uint8Array> {
    console.log(
      "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
    );
    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
    let res = await this.Contract.submitTransaction("InitLedger");
    console.log("*** Transaction committed successfully");
    return res;
  }

  /**
   * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
   * while waiting for the commit notification.
   */
  async transferAssetAsync(
    contract: Contract,
    assetId: string,
    newOwnerName: string
  ): Promise<void> {
    console.log(
      "\n--> Async Submit Transaction: TransferAsset, updates existing asset owner"
    );

    const commit = await contract.submitAsync("TransferAsset", {
      arguments: [assetId, newOwnerName],
    });
    const utf8Decoder = new TextDecoder();
    const oldOwner = utf8Decoder.decode(commit.getResult());

    console.log(
      `*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`
    );
    console.log("*** Waiting for transaction commit");

    const status = await commit.getStatus();
    if (!status.successful) {
      throw new Error(
        `Transaction ${status.transactionId} failed to commit with status code ${status.code}`
      );
    }

    console.log("*** Transaction committed successfully");
  }

  async newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(this.tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(this.peerEndpoint, tlsCredentials, {
      "grpc.ssl_target_name_override": this.peerHostAlias,
    });
  }

  async newIdentity(): Promise<Identity> {
    const certPath = await this.getFirstDirFileName(this.certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    const mspId = this.mspId;
    return { mspId, credentials };
  }

  async getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    return path.join(dirPath, files[0]);
  }

  async newSigner(): Promise<Signer> {
    const keyPath = await this.getFirstDirFileName(this.keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
  }
}

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}
