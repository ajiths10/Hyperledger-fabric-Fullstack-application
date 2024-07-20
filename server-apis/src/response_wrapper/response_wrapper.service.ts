import { Injectable } from '@nestjs/common';
import { errorResponse, successResponse } from './types/response_wrapper.types';

@Injectable()
export class ResponseWrapperService {
    constructor() {}

    /**
     * Generates a success response with optional data.
     * @param {string} message - The success message.
     * @param {any} [data] - Optional data to include in the response.
     * @returns {{status: boolean, message: string, data: any}} The success response object.
     */
    _successResponse(message: string, data?: any): successResponse {
        return {
            status: true,
            message: message,
            data: data,
        };
    }

    /**
     * Generates an error response with a message.
     * @param {string} message - The error message.
     * @returns {{status: boolean, message: string}} The error response object.
     */
    _errorResponse(message: string): errorResponse {
        return {
            status: false,
            message: message,
        };
    }
}
