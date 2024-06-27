import { Injectable, OnModuleInit } from "@nestjs/common";
import { CreateCarGarageDto } from "./dto/create-car-garage.dto";
import { UpdateCarGarageDto } from "./dto/update-car-garage.dto";
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
export class CarGarageService implements OnModuleInit {
    private readonly channelName: string;
    private readonly contractName: string;
    private readonly chaincodeName: string;
    private readonly mspId: string;
    private readonly cryptoPath: string;
    private readonly keyDirectoryPath: string;
    private readonly certDirectoryPath: string;
    private readonly tlsCertPath: string;
    private readonly peerEndpoint: string;
    private readonly peerHostAlias: string;
    private Contract: Contract;

    constructor() {
        this.channelName = "garagecars";
        this.contractName = "CarGarageContract";
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
        this.Contract = await this.connectToChannel(
            this.channelName,
            this.chaincodeName
        );
    }

    private async connectToChannel(channelName: string, chaincodeName: string) {
        try {
            const client = await this.newGrpcConnection();
            const gateway = connect({
                client,
                identity: await this.newIdentity(),
                signer: await this.newSigner(),
                evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
                endorseOptions: () => ({ deadline: Date.now() + 15000 }),
                submitOptions: () => ({ deadline: Date.now() + 5000 }),
                commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
            });

            const network = gateway.getNetwork(channelName);
            const contract = network.getContract(
                chaincodeName,
                this.contractName
            );
            return contract;
        } catch (error) {
            console.error(
                `Failed to connect to channel ${channelName}:`,
                error
            );
            process.exitCode = 1;
        }
    }

    getContract(channelName: string) {
        return this.Contract[channelName];
    }

    /**
     * Submit a transaction synchronously, blocking until it has been committed to the ledger.
     */
    async create(CreateCarGarageDto: CreateCarGarageDto) {
        const { Model, Color, Owner, Year, VIN, EngineType, Mileage } =
            CreateCarGarageDto;
        console.log(
            "\n--> Submit Transaction: CreateGarageCarAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments"
        );
        const assetId = `asset${Date.now()}`;
        const json = JSON.stringify({
            ID: assetId,
            Model: Model,
            Color: Color,
            Owner: Owner,
            Year: Year,
            VIN: VIN,
            EngineType: EngineType,
            Mileage: Mileage,
        });
        try {
            // Create a new asset on the ledger.
            await this.Contract.submitTransaction(
                "CreateGarageCarAsset", // Smart Contract/Chain code Ref
                json
            );
        } catch (error) {
            console.error("******** FAILED to run the application:", error);
            return error;
            //  process.exitCode = 1;
        }

        return "*** Transaction committed successfully";
    }

    /**
     * Evaluate a transaction to query ledger state.
     * Return all the current assets on the ledger.
     */
    async findAll() {
        console.log(
            "\n--> Evaluate Transaction: GetAllGarageCars, function returns all the current assets on the ledger"
        );
        try {
            const resultBytes =
                await this.Contract.evaluateTransaction("GetAllGarageCars"); // "GetAllGarageCars" Smart Contract/ChainCode Ref
            const utf8Decoder = new TextDecoder();
            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            console.log("*** Result:", result);
            return result;
        } catch (error) {
            return {
                message: `******** FAILED to return an error`,
                data: error,
            };
        }
    }

    // Return all the current assets on the ledger.
    async findAssetHistory(assetID: string) {
        let data = await this.getassetHistory(this.Contract, assetID);
        return data;
    }

    // Get the asset details by assetID.
    async findOne(assetId: string) {
        try {
            console.log(
                "\n--> Evaluate Transaction: ReadAsset, function returns asset attributes"
            );

            const resultBytes = await this.Contract.evaluateTransaction(
                "ReadAsset", // Smart Contract/Chain code Ref
                assetId
            );
            const utf8Decoder = new TextDecoder();
            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            console.log("*** Result:", result);

            return {
                message: `This action Returns asset - #${assetId} `,
                data: result,
            };
        } catch (error) {
            return {
                message: `******** FAILED to return an error`,
                data: error,
            };
        }
    }

    /**
     * Submit a transaction synchronously, blocking until it has been committed to the ledger.
     * Update asset on the ledger.
     */
    // async update(assetId: string, UpdateCarGarageDto: UpdateCarGarageDto) {
    //   try {
    //     let res = await this.Contract.submitTransaction(
    //       "UpdateAsset", // Smart Contract/Chain code Ref
    //       assetId,
    //       updateBlockchainDto.Color,
    //       updateBlockchainDto.Size,
    //       updateBlockchainDto.Owner,
    //       updateBlockchainDto.AppraisedValue
    //     );

    //     return {
    //       message: `This action updates asset - #${assetId} `,
    //       data: res,
    //     };
    //   } catch (error) {
    //     return {
    //       message: `******** FAILED to return an error`,
    //       data: error,
    //     };
    //   }
    // }

    /**
     * Submit a transaction synchronously, blocking until it has been committed to the ledger.
     * Delete asset on the ledger.
     */
    async remove(assetId: string) {
        try {
            let res = await this.Contract.submitTransaction(
                "DeleteAsset", // Smart Contract/Chain code Ref
                assetId
            );

            return {
                message: `This action deleted asset - #${assetId} `,
                data: res,
            };
        } catch (error) {
            return {
                message: `******** FAILED to return an error`,
                data: error,
            };
        }
    }

    // Update an existing asset owner asynchronously.
    async updateAssetOwner(
        assetId: string,
        payload: UpdateAssetOwnerBlockchainDto
    ) {
        let res = await this.transferAssetAsync(
            this.Contract,
            assetId,
            "Ajith"
        );
        return {
            message: `This action updates a #${assetId} blockchain`,
            data: res,
        };
    }

    /**
     * Evaluate a transaction to query ledger state.
     */
    async getassetHistory(contract: Contract, assetID: string): Promise<void> {
        console.log(
            "\n--> Evaluate Transaction: GetHistoryForKey, function returns all the current assets history on the ledger"
        );

        const resultBytes = await contract.evaluateTransaction(
            "GetHistoryForKey",
            assetID
        ); // "GetHistoryForKey" Smart Contract/Chain code Ref
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
    async initLedger() {
        try {
            console.log(
                "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
            );
            // Initialize a set of asset data on the ledger using the chaincode 'InitGarageCarLedger' function.
            let res = await this.Contract.submitTransaction(
                "InitGarageCarLedger"
            ); // "InitGarageCarLedger" Smart Contract/Chain code Ref
            console.log("*** Transaction committed successfully");
            return res;
        } catch (error) {
            return {
                message: `******** FAILED to return an error`,
                data: error,
            };
        }
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

        // "TransferAsset" Smart Contract/Chain code Ref
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

    private async newGrpcConnection(): Promise<grpc.Client> {
        const tlsRootCert = await fs.readFile(this.tlsCertPath);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(this.peerEndpoint, tlsCredentials, {
            "grpc.ssl_target_name_override": this.peerHostAlias,
        });
    }

    private async newIdentity(): Promise<Identity> {
        const certPath = await this.getFirstDirFileName(this.certDirectoryPath);
        const credentials = await fs.readFile(certPath);
        const mspId = this.mspId;
        return { mspId, credentials };
    }

    private async getFirstDirFileName(dirPath: string): Promise<string> {
        const files = await fs.readdir(dirPath);
        return path.join(dirPath, files[0]);
    }

    private async newSigner(): Promise<Signer> {
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
