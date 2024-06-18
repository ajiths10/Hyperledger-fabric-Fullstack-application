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
  Contract: any;

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

    const utf8Decoder = new TextDecoder();
    const assetId = `asset${Date.now()}`;

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

  create(createBlockchainDto: CreateBlockchainDto) {
    return "This action adds a new blockchain";
  }

  async findAll() {
    let data = await this.getAllAssets(this.Contract);
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} blockchain`;
  }

  update(id: number, updateBlockchainDto: UpdateBlockchainDto) {
    return `This action updates a #${id} blockchain`;
  }

  remove(id: number) {
    return `This action removes a #${id} blockchain`;
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
