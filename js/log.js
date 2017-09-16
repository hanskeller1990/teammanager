const logLevelDebug = 0;
const logLevelInfo = 1;
const logLevelError = 2;

var logLevel = logLevelDebug;

function debug(data) {
    if (logLevel == logLevelDebug) {
        console.log(data);
    }
}

function info(data) {
    if (logLevel <= logLevelInfo) {
        console.log(data);
    }
}

function error(data) {
    if (logLevel <= logLevelError) {
        console.log(data);
    }
}