import {fetchApi} from './fetchers/fetchAPI';
import {groupApi} from './fetchers/groupApi';
import simple from './fetchers/simple';

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
    fetchApi, groupApi, ...simple
};
export default sf;
