import { ApiRecord } from '../repo/ApiRecord';
import { FetchResponse } from '../repo/FetchResponse';

/** Response generics extract from ApiRecord */
export type ExtractResponse<R> = R extends ApiRecord<any, any, infer SR, infer ER>
    ? FetchResponse<SR, ER>
    : never;
