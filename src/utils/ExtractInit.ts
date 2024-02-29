import { ApiRecord } from '../repo/ApiRecord';
import { ApiRequestInit } from '../repo/ApiRequestInit';

/** Request init generics extract from ApiRecord */
export type ExtractInit<R> = R extends ApiRecord<infer Q, infer P, any, any, infer B>
    ? ApiRequestInit<Q, P, B>
    : never;
