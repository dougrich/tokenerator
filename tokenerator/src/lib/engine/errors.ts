export interface ErrorFactory {
    new(): Error;
    code: string;
}

function createErrorFactory(code: string): ErrorFactory {
    return class extends Error {
        static code: string;
        constructor() {
            super(code);
        }
    }
}

export const MissingPartFromLookup = createErrorFactory('404:missing-part-lookup');
export const MissingVariantFromPart = createErrorFactory('404:missing-part-variant');