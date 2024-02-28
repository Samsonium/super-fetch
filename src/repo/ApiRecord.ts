/**
 * Request endpoint info. To disable field,
 * pass null value to generic.
 *
 * @template Q  Query parameters (in URL after "?")
 * @template P  Path parameters (replaced ":var" variables)
 * @template SR Successful response body
 * @template ER Unsuccessful response body
 * @template B  Request body
 *
 * @example Define a single API method:
 *  type Query   = { page: number, per_page: number };
 *  type Path    = { id: string };
 *  type Success = { ok: true, items: { title: string }[] };
 *  type Error   = { ok: false, message: string };
 *
 *  export const apiMethod: ApiRepository<Query, Path, Success, Error> = {
 *      endpoint: '/smth/:id/view',
 *      method: 'GET'
 *  };
 *
 * @example Define an API repository
 *  export const apiRepo = {
 *      identity: {
 *          signIn: {
 *              method: 'POST',
 *              endpoint: '/identity/sign-in'
 *          } as ApiRecord<null, null, { access_token: string }, { message: string }, {
 *              login: string,
 *              password: string
 *          }>
 *      },
 *      profile: {
 *          get: {
 *              method: 'GET',
 *              endpoint: '/profile'
 *          } as ApiRecord<{}, {}, { ... }, { message: string }>
 *      }
 *  };
 */
export interface ApiRecord<Q = null, P = null, SR = null, ER = null, B = null> {

    /**
     * Endpoint path. You can use variables
     * like ":var" to define it later.
     */
    endpoint: string;

    /**
     * Endpoint method. Can accept REST API
     * methods like "GET", "POST", etc. and
     * your own custom methods.
     */
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
}
