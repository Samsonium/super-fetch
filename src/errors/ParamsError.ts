import SFError from './SFError';

export default class ParamsError extends SFError {
    public constructor(fields: string[]) {
        super(`Missing these fields in path params: ${fields.join(', ')}`);
    }
}
