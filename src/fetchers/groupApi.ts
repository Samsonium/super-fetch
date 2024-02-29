import { ApiRecord } from '../repo/ApiRecord';
import { ApiRequestInit } from '../repo/ApiRequestInit';
import { ApiRepo, ApiRepoCallable, ExtractInit } from '../utils';
import { fetchApi } from './fetchAPI';

/**
 * Generate functions with API calls based on repository
 * @param baseURL Base url of an API
 * @param repository List of endpoints
 * @param options Default options
 *
 * @template R api repository in format `key` => `ApiRecord` or `api repository`
 */
export function groupApi<R extends ApiRepo>(
    baseURL: string,
    repository: R,
    options?: Omit<ApiRequestInit<null, null, null>, 'query'>
): ApiRepoCallable<R> {
    let result = {} as ApiRepoCallable<R>;
    for (const member in repository) {
        const item = repository[member] as (ApiRecord | ApiRepo);

        if ('endpoint' in item) result = {
            ...result,
            [member]: ((init?: ExtractInit<R[keyof R]>) => {
                return fetchApi(repository[member] as ApiRecord, {
                    ...(options ?? {}),
                    ...(init ?? {}),
                }, baseURL);
            }) as unknown
        };
        else result = {
            ...result,
            [member]: groupApi(baseURL, repository[member] as ApiRepo, options) as unknown
        };
    }

    return result;
}
