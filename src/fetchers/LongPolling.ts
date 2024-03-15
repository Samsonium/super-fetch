import { LongPollingOptions } from '../long-polling/LongPollingOptions';
import { ApiRecord } from '../repo/ApiRecord';

/**
 * Long-polling requests.
 */
export class LongPolling<Q = any, P = any, SR = any, ER = any, B = any> {

    /** Long-polling options */
    private readonly options: LongPollingOptions<Q, P, SR, ER, B>;

    /**
     * Create long-polling instance
     * @param url Endpoint URL or ApiRecord
     * @param options Long-polling options
     */
    public constructor(
        url: ApiRecord<Q, P, SR, ER, B> | URL | string,
        options?: Partial<LongPollingOptions<Q, P, SR, ER, B>>
    ) {
        options ??= {};
        this.options = {
            url,
            autoStart: true,
            delay: 1000,
            timeout: 20,
            ...options
        };
    }
}
