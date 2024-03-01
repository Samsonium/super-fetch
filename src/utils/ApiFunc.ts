import { ApiRecord } from '../repo/ApiRecord';
import { ExtractInit } from './ExtractInit';
import { ExtractResponse } from './ExtractResponse';

/** API group function */
export type ApiFunc<R extends ApiRecord> = (init?: ExtractInit<R>) => Promise<ExtractResponse<R>>;
