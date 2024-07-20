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

    async CreateAsset(ctx, p_id, name, email, phone, dob, blood_group) {
        const exists = await this._assetExists(ctx, p_id);
        if (exists) {
            throw new Error(`The asset ${p_id} already exists`);
        }
        let indexName = 'Zoro123';
        let asset = {
            patient_id: p_id,
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            blood_group: blood_group,
        };
        await ctx.stub.putState(p_id, Buffer.from(JSON.stringify(asset)));
        let patientNameIndexKey = await ctx.stub.createCompositeKey(indexName, [asset.name, asset.patient_id]);
        await ctx.stub.putState(patientNameIndexKey, Buffer.from('\u0000'));
    }

    // << ==================== Intenal functions ========================== >>>
    // For internal functions... prefix them with _

    // AssetExists returns true when asset with given ID exists in world state
    async _assetExists(ctx, assetName) {
        let assetState = await ctx.stub.getState(assetName);
        return assetState && assetState.length > 0;
    }
}

module.exports = PatientContract;
