'use strict';

const { Contract } = require('fabric-contract-api');

class PatientContract extends Contract {
    constructor() {
        //Unique smart contract name when multiple contracts per chaincode
        super('PatientContract');
    }

    async InitPatientsLedger(ctx) {
        const message = 'Hello there, patient contract initiated!, Your good to go.';
        console.log(message);
        return message;
    }
}

module.exports = PatientContract;
