import { FetchResponse } from '../repo/FetchResponse';
import { ApiRecord } from '../repo/ApiRecord';
import { ExtractResponse } from './ExtractResponse';

/**
 * Response data in sequence
 */
export interface SequenceResponse<AR extends ApiRecord> {

    /** Request identifier for counter */
    requestId: number;

    /** Data inside response */
    response: ExtractResponse<AR> | undefined;
}
