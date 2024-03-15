import {fetchApi} from './fetchers/fetchAPI';
import {groupApi} from './fetchers/groupApi';
import simple from './fetchers/simple';
import {Sequence} from './fetchers/sequence';
import {LongPolling} from './fetchers/LongPolling';

// Errors
export {ApiUrlError} from './errors/ApiUrlError';
export {ApiParamsError} from './errors/ApiParamsError';
export {ApiResponseError} from './errors/ApiResponseError';

// API repository
export {ApiRecord} from './repo/ApiRecord';
export {ApiRequestInit} from './repo/ApiRequestInit';
export {FetchResponse} from './repo/FetchResponse';

// Fetchers
const sf = {
    fetchApi, groupApi, ...simple,
    Sequence, LongPolling
};
export default sf;
