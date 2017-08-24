export const shortcuts = {
    'hidden': [Infinity, null],
    'visible': [null, null]
};

export function parseAvailability(errors: string[], key: string, availability: string): number {
    if (!availability) {
        return null;
    } else if (/^[0-9]$/gi.test(availability)) {
        return parseInt(availability);
    } else {
        try {
            return Date.parse(availability);
        } catch (err) {
            errors.push(`${key} needs to contain either a date string or a number; got "${availability}"`);
            return null;
        }
    }
}