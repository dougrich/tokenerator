const sass = require('node-sass');
const fs = require('fs');
const crypto = require('crypto');
const watch = require('node-watch');

function build() {
    return new Promise((resolve, reject) => {
        sass.render({
            file: './src/theme/core.scss',
            outputStyle: 'compressed'
        }, function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(result);
            fs.writeFileSync('./dist/packed/theme.css', result.css, { encoding: 'utf8'});
            resolve();
        })
    });
}

let queue = Promise.resolve();

queue = queue.then(build);
if (process.argv[2] === '-w') {
    queue.then(() => {
        watch('./src/theme', { recursive: true }, function () {
            queue = queue.then(build);
        })
    });
}