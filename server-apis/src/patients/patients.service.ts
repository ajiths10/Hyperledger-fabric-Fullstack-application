import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { LedgerUtilsService } from 'src/ledger-utils/ledger-utils.service';
import { Contract } from '@hyperledger/fabric-gateway';
import { UtilsService } from 'src/utils/utils.service';
import { ResponseWrapperService } from 'src/response_wrapper/response_wrapper.service';

@Injectable()
export class PatientsService implements OnModuleInit {
    private Contract: Contract;
    private readonly channelName: string;
    private readonly contractName: string;
    private readonly chaincodeName: string;

    constructor(
        private readonly ledgerUtilsService: LedgerUtilsService,
        private readonly utilsService: UtilsService,
        private readonly responseWrapperService: ResponseWrapperService,
    ) {
        this.channelName = 'patients';
        this.contractName = 'patientContract';
        this.chaincodeName = this.utilsService._envOrDefault('CHAINCODE_NAME', 'patientsChaincode');
    }

    async onModuleInit() {
        try {
            this.Contract = await this.ledgerUtilsService.connectToChannel({ channelName: this.channelName, chaincodeName: this.chaincodeName });
        } catch (error) {
            console.log('<<< ====== Connet to Channel Error ====== >>>');
            console.log(error?.message);
        }
    }

    async initLedger() {
        try {
            console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
            // Initialize a set of asset data on the ledger using the chaincode 'InitPatientsLedger' function.
            let response = await this.Contract.submitTransaction('InitPatientsLedger'); // "InitPatientsLedger" Smart Contract/Chain code Ref
            console.log('*** Transaction committed successfully ***');
            return this.responseWrapperService._successResponse('Transaction committed successfully', response);
        } catch (error) {
            console.log(`******** FAILED to return an error ***********`, error.message);
            return this.responseWrapperService._errorResponse(error);
        }
    }

    async create(body: CreatePatientDto) {
        try {
            console.log('\n--> Submit Transaction: CreateAsset');
            let response = await this.Contract.submitTransaction('CreateAsset', 'Asset_003', body.name, body.email, body.phone, body.dob, body.blood_group);
            console.log('*** Transaction committed successfully ***');
            return this.responseWrapperService._successResponse('Transaction committed successfully: "Patient created successfully!"', response);
        } catch (error) {
            console.log(`******** FAILED to return an error ***********`, error.message);
            return this.responseWrapperService._errorResponse(error);
        }
    }

    findAll() {
        return `This action returns all patients`;
    }

    async findOne(id: string) {
        try {
            console.log('\n--> Submit Transaction: ReadAsset');
            let resultBytes = await this.Contract.evaluateTransaction('ReadAsset', id);
            console.log('*** Evaluation Transaction successfully ***');
            const response = this.utilsService._prettyJSONString(resultBytes);
            return this.responseWrapperService._successResponse('Evaluation Transaction successfully', response);
        } catch (error) {
            console.log(`******** FAILED to return an error ***********`, error.message);
            return this.responseWrapperService._errorResponse(error);
        }
    }

    update(id: number, updatePatientDto: UpdatePatientDto) {
        return `This action updates a #${id} patient`;
    }

    remove(id: number) {
        return `This action removes a #${id} patient`;
    }
}
