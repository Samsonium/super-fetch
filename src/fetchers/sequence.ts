import { ApiRecord } from '../repo/ApiRecord';
import { SequenceResponse } from '../utils/SequenceResponse';
import { ExtractInit, ExtractResponse } from '../utils';
import { fetchApi } from './fetchAPI';

/** Sequence */
export class Sequence<AR extends ApiRecord> {
    private readonly record: AR;
    private readonly sendOptions: ExtractInit<AR> | undefined;

    /** Responses counter */
    private requestCounter: number;

    /** Last sequence data */
    private lastData: SequenceResponse<AR> | undefined;

    /** Create sequence with ApiRecord typings */
    public constructor(record: AR, options?: ExtractInit<AR>) {
        this.requestCounter = 0;
        this.record = record;
        this.sendOptions = options;
    }

    /**
     * Make request
     * @param options Request options
     */
    public async call(options?: ExtractInit<AR>): Promise<void> {
        const requestId = ++this.requestCounter;

        // Make request through fetchApi
        const response = await fetchApi(this.record,
            options ?? this.sendOptions) as ExtractResponse<AR>;

        if (response.ok && requestId > (this.lastData?.requestId ?? 0)) {
            this.lastData = {
                requestId,
                response
            };
        }
    }

    /** Read last data */
    public read() {
        return this.lastData?.response;
    }
}
