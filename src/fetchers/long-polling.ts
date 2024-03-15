import { LongPollingOptions } from '../long-polling/LongPollingOptions';
import { PollStep } from '../long-polling/PollStep';
import { ApiRecord } from '../repo/ApiRecord';
import { ApiRequestInit } from '../repo/ApiRequestInit';
import { fetchApi } from './fetchAPI';

/**
 * Long-polling requests.
 */
export class LongPolling<Q = any, P = any, SR = any, ER = any, B = any> {

    /** Long-polling options */
    private readonly options: LongPollingOptions<Q, P, SR, ER, B> & {
        url: ApiRecord<Q, P, SR, ER, B>
    };

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

        // Start polling if `autoStart`
        if (this.options.autoStart) this.start();
    }

    /** Begin long-polling */
    public start() {
        if (this.pollingStarted) {
            console.warn('Long-polling already started');
            return;
        }

        this.pollingStarted = true;
        this.poll().then();
    }

    /** Stop long-polling */
    public stop() {
        if (!this.pollingStarted) {
            console.warn('Long-polling is not running');
            return;
        }

        this.pollingStarted = false;
    }

    /**
     * Poll step
     * @private
     */
    private async poll() {
        if (!this.pollingStarted) return;

        // Retrieve options
        const {
            url,
            timeout,
            timeoutRetries,
            request,
            delay
        } = this.options;

        // Create timeout
        const ctrl = new AbortController();
        const timeoutID = setTimeout(() => {
            ctrl.abort('Timeout from super-fetch');
            this.timeouts++;

            if (this.timeouts < timeoutRetries) setTimeout(this.poll.bind(this), delay);
            else this.stop();
        }, timeout * 1000);

        // Make call
        const res = await fetchApi(url, request);

        // Clear aborting timeout and reset timeouts counter
        clearTimeout(timeoutID);
        this.timeouts = 0;

        // Stop execution if fetch has been aborted
        if (ctrl.signal.aborted) return;

        // Execute poll handling function and call next poll
        const continuing = this.pollHandler(res);
        if (continuing) setTimeout(this.poll.bind(this), delay);
    }
}
