import { Injectable } from '@nestjs/common';
import { CreateMotocycleGarageDto } from './dto/create-motocycle-garage.dto';
import { UpdateMotocycleGarageDto } from './dto/update-motocycle-garage.dto';
import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';

@Injectable()
export class MotocycleGarageService {
    private readonly channelName: string;
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
        (this.channelName = 'garagebikes'), (this.chaincodeName = envOrDefault('CHAINCODE_NAME_GARAGECARS', 'basic')), (this.mspId = envOrDefault('MSP_ID', 'Org1MSP'));
        this.cryptoPath = envOrDefault(
            'CRYPTO_PATH',
            path.resolve('/home/ajiths/Desktop/PersonalProjects/blockchain/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com'),
        );
        this.keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));
        this.certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));
        this.tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(this.cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));
        this.peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');
        this.peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

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
        this.Contract = await this.connectToChannel(this.channelName, this.chaincodeName);
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
            // IMPORTANT - You need to explicitly request the correct contract within the chaincode package
            // IMPORTANT - Ref - https://github.com/hyperledger/fabric-samples/issues/1229
            const contract = network.getContract(chaincodeName);
            return contract;
        } catch (error) {
            console.error(`Failed to connect to channel ${channelName}:`, error);
            process.exitCode = 1;
        }
    }

    getContract(channelName: string) {
        return this.Contract[channelName];
    }

    create(createMotocycleGarageDto: CreateMotocycleGarageDto) {
        return 'This action adds a new motocycleGarage';
    }

    async findAll() {
        console.log('\n--> Evaluate Transaction: GetAllGarageCars, function returns all the current assets on the ledger');
        try {
            const resultBytes = await this.Contract.evaluateTransaction('GetAllGarageBikes'); // "GetAllGarageCars" Smart Contract/ChainCode Ref
            const utf8Decoder = new TextDecoder();
            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            console.log('*** Result:', result);
            return result;
        } catch (error) {
            return {
                message: `******** FAILED to return an error`,
                data: error,
            };
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} motocycleGarage`;
    }

    update(id: number, updateMotocycleGarageDto: UpdateMotocycleGarageDto) {
        return `This action updates a #${id} motocycleGarage`;
    }

    remove(id: number) {
        return `This action removes a #${id} motocycleGarage`;
    }

    /**
     * This type of transaction would typically only be run once by an application the first time it was started after its
     * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
     */
    async initLedger(): Promise<Uint8Array> {
        console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
        // Initialize a set of asset data on the ledger using the chaincode 'InitGarageCarLedger' function.
        let res = await this.Contract.submitTransaction('InitGarageBikeLedger'); // "InitGarageCarLedger" Smart Contract/Chain code Ref
        console.log('*** Transaction committed successfully');
        return res;
    }

    private async newGrpcConnection(): Promise<grpc.Client> {
        const tlsRootCert = await fs.readFile(this.tlsCertPath);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(this.peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': this.peerHostAlias,
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
