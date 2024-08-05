import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    constructor() {}

    _envOrDefault(key: string, defaultValue: string): string {
        return process.env[key] || defaultValue;
    }

    /**
     * Converts a byte buffer to a JSON object.
     * This function takes a buffer, decodes it using UTF-8, and then parses the decoded string into a JSON object.
     * If the input buffer does not contain valid JSON, an error message is returned.
     * @param {AllowSharedBufferSource} resultBytes - The byte buffer to be converted to a JSON object.
     * @returns {Object|string} The resulting JSON object or an error message if the JSON is invalid.
     */
    _prettyBufferToObject(resultBytes: AllowSharedBufferSource) {
        try {
            const utf8Decoder = new TextDecoder();
            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            return result;
        } catch (e) {
            return 'Err:Invalid JSON string';
        }
    }
}
