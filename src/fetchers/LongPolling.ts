import { LongPollingOptions } from '../long-polling/LongPollingOptions';
import { ApiRecord } from '../repo/ApiRecord';

/**
 * Long-polling requests.
 */
export class LongPolling<Q = any, P = any, SR = any, ER = any, B = any> {

    /** Long-polling options */
    private readonly options: LongPollingOptions<Q, P, SR, ER, B>;

    /** Poll step handler */
    private readonly pollHandler: PollStep<SR, ER>;

    /** Long-polling state */
    private pollingStarted: boolean;

    /** Number of consecutive timeouts */
    private timeouts: number;

    /**
     * Create long-polling instance
     * @param url Endpoint URL or ApiRecord
     * @param pollHandler Poll response handler. A Boolean in the
     *                    return type indicates the need to continue
     *                    polling. If `true` - continue poll, else stop
     * @param options Long-polling options
     */
    public constructor(
        url: ApiRecord<Q, P, SR, ER, B> | URL | string,
        pollHandler: PollStep<SR, ER>,
        options?: Partial<LongPollingOptions<Q, P, SR, ER, B>>
    ) {
        options ??= {};

        // If url is not ApiRecord
        if (typeof url === 'string' || url instanceof URL) {
            url = {
                method: 'GET',
                endpoint: url instanceof URL ? url.toString() : url
            };
        }

        // Set variables
        this.options = {
            url,
            autoStart: true,
            delay: 1000,
            timeout: 20,
            timeoutRetries: 3,
            request: {} as ApiRequestInit<Q, P, B>,
            ...options
        };
        this.pollHandler = pollHandler;
        this.pollingStarted = false;
        this.timeouts = 0;
    }
}
