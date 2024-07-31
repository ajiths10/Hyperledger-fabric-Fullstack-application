import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    constructor() {}

    _envOrDefault(key: string, defaultValue: string): string {
        return process.env[key] || defaultValue;
    }

    _prettyJSONString(resultBytes: AllowSharedBufferSource) {
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
