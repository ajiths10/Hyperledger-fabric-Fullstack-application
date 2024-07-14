import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
    constructor() {}

    _envOrDefault(key: string, defaultValue: string): string {
        return process.env[key] || defaultValue;
    }
}
