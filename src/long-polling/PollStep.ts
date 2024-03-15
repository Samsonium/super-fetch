import { FetchResponse } from '../repo/FetchResponse';

/**
 * Function that calls after each poll finish.
 * Accepts response data and returns a boolean
 * that indicates the need to continue polling.
 * To continue poll function must return `true`,
 * otherwise polling will stop.
 *
 * @template SR success body response
 * @template ER error body response
 */
export type PollStep<SR, ER> = (res: FetchResponse<SR, ER>) => boolean;
