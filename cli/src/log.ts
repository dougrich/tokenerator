import "colors";

export function update(filename: string) {
    console.log(`Updated ${filename}`.yellow);
}

export function errors(filename: string, errors: string[]) {
    console.log(`✗ ${filename}`.red);
    for (let error of errors) {
        console.log('  ' + error.trim());
    }
}

export function summary(okay: string[], bad: string[], conflicts: { [id: string]: string[] }): number {
    if (okay.length > 0) {
        console.log(`✔ Okay: ${okay.length.toString()}`.green);
    }
    let errors = 0;
    if (bad.length > 0) {
        console.log(`✗ Need attention: ${bad.length.toString()}`.red);
        let count = 0;
        errors += bad.length;
        for (let badFile of bad) {
            console.log('  ' + badFile);
            if (++count === 10) {
                console.log(`  ...${bad.length - 10} more`.magenta);
                break;
            }
        }
    }
    for (let id in conflicts) {
        if (conflicts[id].length > 1 || id === 'template') {
            errors++;
            console.log(`✗ part id "${id}" is used by multiple files`.red);
            let count = 0;
            for (let badFile of conflicts[id]) {
                console.log('  ' + badFile);
                if (++count === 10) {
                    console.log(`  ...${conflicts[id].length - 10} more`.magenta);
                    break;
                }
            }
        }
    }
    return errors;
}