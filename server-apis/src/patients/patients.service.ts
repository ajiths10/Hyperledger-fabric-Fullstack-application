import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { LedgerUtilsService } from 'src/ledger-utils/ledger-utils.service';
import { Contract } from '@hyperledger/fabric-gateway';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class PatientsService implements OnModuleInit {
    private Contract: Contract;
    private readonly channelName: string;
    private readonly contractName: string;
    private readonly chaincodeName: string;

    constructor(
        private ledgerUtilsService: LedgerUtilsService,
        private utilsService: UtilsService,
    ) {
        this.channelName = 'patients';
        this.contractName = 'patientContract';
        this.chaincodeName = this.utilsService._envOrDefault('CHAINCODE_NAME', 'basic');
    }

    async onModuleInit() {
        try {
            this.Contract = await this.ledgerUtilsService.connectToChannel({ channelName: this.channelName, chaincodeName: this.chaincodeName, contractName: this.contractName });
        } catch (error) {
            console.log('<<< ====== Connet to Channel Error ====== >>>');
            console.log(error?.message);
        }
    }

    initLedger() {
        return 'This action adds a new patient';
    }

    create(createPatientDto: CreatePatientDto) {
        return 'This action adds a new patient';
    }

    findAll() {
        return `This action returns all patients`;
    }

    findOne(id: number) {
        return `This action returns a #${id} patient`;
    }

    update(id: number, updatePatientDto: UpdatePatientDto) {
        return `This action updates a #${id} patient`;
    }

    remove(id: number) {
        return `This action removes a #${id} patient`;
    }
}
