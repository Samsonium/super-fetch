import { ApiRecord } from '../repo/ApiRecord';
import { ApiFunc } from './ApiFunc';

/** Return type for `groupApi` with callable members */
export type ApiRepoCallable<R extends Record<string, ApiRecord | any>> = {
    [P in keyof R]: R[P] extends ApiRecord ? ApiFunc<R[P]> : ApiRepoCallable<R[P]>;
};
