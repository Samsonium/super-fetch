import {fetchApi} from './fetchers/fetchAPI';

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
    fetchApi
};
export default sf;
