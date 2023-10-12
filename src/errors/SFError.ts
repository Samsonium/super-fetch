export default class SFError extends Error {
    public constructor(message: string) {
        super(`[strict-fetch] ${message}`);
    }
}
