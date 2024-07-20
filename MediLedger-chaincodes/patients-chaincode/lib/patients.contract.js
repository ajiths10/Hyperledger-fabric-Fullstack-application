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

    async CreateAsset(ctx, patientData) {
        const exists = await this.AssetExists(ctx, patientData.patient_id);
        if (exists) {
            throw new Error(`The asset ${patientData.patient_id} already exists`);
        }
        let indexName = 'Zoro123';
        let asset = {
            patient_id: patientData.patient_id,
            name: patientData.name,
            email: patientData.email,
            phone: patientData.phone,
            dob: patientData.dob,
            blood_group: patientData.blood_group,
        };
        await ctx.stub.putState(assetID, Buffer.from(JSON.stringify(asset)));
        let colorNameIndexKey = await ctx.stub.createCompositeKey(indexName, [asset.name, asset.patient_id]);
        await ctx.stub.putState(colorNameIndexKey, Buffer.from('\u0000'));
    }
}

module.exports = PatientContract;
