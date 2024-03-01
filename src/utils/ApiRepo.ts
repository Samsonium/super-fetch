import { ApiRecord } from '../repo/ApiRecord';

/** API repository format */
export type ApiRepo<R extends Record<string, ApiRecord | any> = {}> = {
    [P in keyof R]: ApiRecord | ApiRepo<R[P]>
};
