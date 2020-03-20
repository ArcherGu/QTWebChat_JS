export function createSender(QtServer) {
    return ({ action, data = '' }) => {
        return new Promise((resolve, reject) => {
            if (!Object.keys(QtServer).includes(action)) {
                return reject(new Error('[SENDER]: Unknown action name !'));
            }
            if (typeof QtServer[action] !== 'function') {
                return reject(
                    new Error(
                        typeof QtServer[action].connect === 'function' ?
                        `[SENDER]: ${action} is a Qt signal, not a method` :
                        `[SENDER]: Missing function named ${action} in QObject !`
                    )
                )
            }
            QtServer[action](data, resolve)
        })
    }
}

export function createListener(QtServer) {
    return (event, callback) => {
        if (!Object.keys(QtServer).includes(event)) {
            return reject(new Error('[LISTENER]: Unknown event name!'));
        }

        if (!Object.keys(QtServer[event]).includes('connect')) {
            return reject(
                new Error(`[LISTENER]: ${event} is not a Qt signa!`)
            )
        }

        if (typeof QtServer[event].connect !== 'function') {
            return reject(
                new Error(`[LISTENER]: No Connect Function!`)
            )
        }
        QtServer[event].connect(callback);
    }
}