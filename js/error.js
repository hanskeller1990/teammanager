function noError(data) {
    if (data.type) {
        if (data.type === 'Info') {
            return true;
        }
        return false;
    }
    return true;
}