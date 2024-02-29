import {fetchApi} from './fetchers/fetchAPI';
import {groupApi} from './fetchers/groupApi';

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
    fetchApi, groupApi
};
export default sf;
