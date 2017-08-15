let serverInstance;
let serverFilename;


function clearServer(state) {
    console.log('CLEARING STATE');
    let chain = Promise.resolve();
    if (serverInstance) {
        chain = chain.then(() => {
            return serverInstance.stop();
        });
    }
    chain = chain.then(() => {
        delete require.cache[require.resolve(serverFilename)];
    });

    return chain;
}

function loadServer() {
    serverFilename = '../dist/packed/server.js';
    const serverChain = require(serverFilename);
    return serverChain.then(server => {
        serverInstance = server;    
    })
}

if (process.argv.indexOf('-w') >= 0) {
    const watch = require('node-watch');
    let queue = loadServer();
    watch('./dist/packed', { recursive: true }, function () {
        console.log('changed');
        queue = queue.then(clearServer);
        queue = queue.then(loadServer);
    });
} else {
    loadServer();
}