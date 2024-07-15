import { Injectable } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { UtilsService } from 'src/utils/utils.service';

type connectToChannelParamsType = {
    channelName: string;
    chaincodeName: string;
    contractName?: string;
};

@Injectable()
export class LedgerUtilsService {
    private readonly mspId: string;
    private readonly cryptoPath: string;
    private readonly keyDirectoryPath: string;
    private readonly certDirectoryPath: string;
    private readonly tlsCertPath: string;
    private readonly peerEndpoint: string;
    private readonly peerHostAlias: string;
    private Contract: Contract;

    constructor(private utilsService: UtilsService) {
        // this.chaincodeName = this.utilsService._envOrDefault('CHAINCODE_NAME', 'basic');
        this.mspId = this.utilsService._envOrDefault('MSP_ID', 'Org1MSP');

        // Path to crypto materials.
        this.cryptoPath = this.utilsService._envOrDefault(
            'CRYPTO_PATH',
            path.resolve('/home/ajiths/Desktop/PersonalProjects/blockchain/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com'),
        );

        // Path to user private key directory.
        this.keyDirectoryPath = this.utilsService._envOrDefault('KEY_DIRECTORY_PATH', path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

        // Path to user certificate directory.
        this.certDirectoryPath = this.utilsService._envOrDefault('CERT_DIRECTORY_PATH', path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));

        // Path to peer tls certificate.
        this.tlsCertPath = this.utilsService._envOrDefault('TLS_CERT_PATH', path.resolve(this.cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

        // Gateway peer endpoint.
        this.peerEndpoint = this.utilsService._envOrDefault('PEER_ENDPOINT', 'localhost:7051');

        // Gateway peer SSL host name override.
        this.peerHostAlias = this.utilsService._envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');
    }

    async connectToChannel(params: connectToChannelParamsType) {
        const { channelName, chaincodeName, contractName } = params;
        try {
            const client = await this._newGrpcConnection();
            const gateway = connect({
                client,
                identity: await this._newIdentity(),
                signer: await this._newSigner(),
                evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
                endorseOptions: () => ({ deadline: Date.now() + 15000 }),
                submitOptions: () => ({ deadline: Date.now() + 5000 }),
                commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
            });

            const network = gateway.getNetwork(channelName);
            // IMPORTANT - You need to explicitly request the correct contract within the chaincode package
            // IMPORTANT - Ref - https://github.com/hyperledger/fabric-samples/issues/1229
            const contract = network.getContract(chaincodeName, contractName);

            /**
             * displayInputParameters() will print the global scope parameters used by the main driver routine.
             */
            console.log(`channelName:       ${channelName}`);
            console.log(`chaincodeName:     ${chaincodeName}`);
            console.log(`contractName:      ${contractName}`);
            console.log(`mspId:             ${this.mspId}`);
            console.log(`cryptoPath:        ${this.cryptoPath}`);
            console.log(`keyDirectoryPath:  ${this.keyDirectoryPath}`);
            console.log(`certDirectoryPath: ${this.certDirectoryPath}`);
            console.log(`tlsCertPath:       ${this.tlsCertPath}`);
            console.log(`peerEndpoint:      ${this.peerEndpoint}`);
            console.log(`peerHostAlias:     ${this.peerHostAlias}`);
            return contract;
        } catch (error) {
            console.error(`Failed to connect to channel ${channelName}:`, error);
            process.exitCode = 1;
        }
    }

    _getContract(channelName: string) {
        return this.Contract[channelName];
    }

    private async _newGrpcConnection(): Promise<grpc.Client> {
        const tlsRootCert = await fs.readFile(this.tlsCertPath);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(this.peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': this.peerHostAlias,
        });
    }

    private async _newIdentity(): Promise<Identity> {
        const certPath = await this._getFirstDirFileName(this.certDirectoryPath);
        const credentials = await fs.readFile(certPath);
        const mspId = this.mspId;
        return { mspId, credentials };
    }

    private async _getFirstDirFileName(dirPath: string): Promise<string> {
        const files = await fs.readdir(dirPath);
        return path.join(dirPath, files[0]);
    }

    private async _newSigner(): Promise<Signer> {
        const keyPath = await this._getFirstDirFileName(this.keyDirectoryPath);
        const privateKeyPem = await fs.readFile(keyPath);
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        return signers.newPrivateKeySigner(privateKey);
    }
}
