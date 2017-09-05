const collisions = {
    'body': 1 << 0,
    'clothing': 1 << 1,
    'jacket': 1 << 2,
    'tail': 1 << 3,
    'ear': 1 << 4,
    'back': 1 << 5,
    'face': 1 << 6,
    'facial-hair': 1 << 7,
    'hair': 1 << 8,
    'hat': 1 << 9,
    'left-weapon': 1 << 10,
    'right-weapon': 1 << 11,
    'collar': 1 << 12,
    'pauldron': 1 << 13
};

export function getCollision(errors: string[], key: string, value: string): number {
    if (!value) {
        errors.push(`${key} missing collision [collision]`);
        return 0;
    } else if (/^[0-9]$/gi.test(value)) {
        return parseInt(value);
    } else {
        const parts = value.split('+');
        let slots = 0;
        for (const part of parts) {
            if (!collisions[part]) {
                errors.push(`${key} includes an invalid collision shortcut: got ${part}, expected one of ${Object.keys(collisions).join(', ')}`);
            } else {
                slots = slots | collisions[part];
            }
        }
        return slots;
    }
}