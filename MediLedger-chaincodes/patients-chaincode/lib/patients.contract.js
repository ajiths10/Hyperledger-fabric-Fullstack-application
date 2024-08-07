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
        return { message, status: true };
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
        return {
            message: `#${p_id} Asset created successfully.`,
            status: true,
        };
    }

    async ReadAsset(ctx, id) {
        const assetJSON = await this._findAssetById(ctx, id);
        return assetJSON.toString();
    }

    // << =========================================== Intenal Functions ===========================================  >>
    // For internal functions... prefix them with _

    /**
     * Finds an asset by its ID in the blockchain state.
     * @param {Context} ctx The transaction context.
     * @param {string} assetId The ID of the asset to find.
     * @param {boolean} [validation=false] Indicates whether to validate asset existence (default: false).
     * @returns {Promise<Buffer>} The state of the asset retrieved from the chaincode state.
     * @throws {Error} Throws an error if asset does not exist and validation is enabled.
     */
    async _findAssetById(ctx, assetId, validation = false) {
        let assetState = await ctx.stub.getState(assetId); // get the asset from chaincode state
        if (validation) {
            if (!assetState || assetState.length === 0) {
                throw new Error(`Asset ${id} does not exist`);
            }
        }
        return assetState;
    }

    /**
     * Checks if an asset with the given ID exists in the world state.
     * @param {Object} ctx - The transaction context.
     * @param {string} assetName - The name (ID) of the asset.
     * @returns {Promise<boolean>} A promise that resolves to true if the asset exists, otherwise false.
     */
    async _assetExists(ctx, assetName) {
        let assetState = await this._findAssetById(ctx, assetName);
        return assetState && assetState.length > 0;
    }

    /**
     * Processes results from an iterator, handling either historical or current data.
     * @param {Object} iterator - An iterator providing access to the results.
     * @param {boolean} isHistory - A flag indicating if the data is historical.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of results.
     */
    async _processQueryResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }
}

module.exports = PatientContract;
