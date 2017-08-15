export class Exception extends Error {
    constructor(
        public code: number,
        public status: string
    ) {
        super(`${code}:${status}`);
    }
}