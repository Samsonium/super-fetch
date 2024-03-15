import { ApiRecord } from '../repo/ApiRecord';

/** Long-polling setup options */
export interface LongPollingOptions<Q, P, SR, ER, B> {
    /** Long-polling target URL */
    url: URL | string | ApiRecord<Q, P, SR, ER, B>,

    /**
     * Connection timeout in seconds.
     * Default: `20`
     */
    timeout: number;

    /**
     * Should long-polling start after instance created.
     * Default: `true`
     */
    autoStart: boolean;

    /**
     * Delay before next request in milliseconds.
     * Default: `1000`
     */
    delay: number;
}
