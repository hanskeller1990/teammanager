/**
 * @class Error
 */

/**
 * @method noError
 * @param data response from server (in JSON format)
 * @return true for 'Info' messages and general messages, false for 'Warning' and 'Error' messages
 */
function noError(data) {
    if (data.type) {
        if (data.type === 'Info') {
            return true;
        }
        return false;
    }
    return true;
}

/**
 * @method shouldBe401
 * @param data response from server (in JSON format)
 * @return true messages that contain type 'Warning' and message 'Benutzername und/oder Passwort ist ungültig.'
 */
function shouldBe401(data) {
    return (data.type && data.type === 'Warning' && data.message === 'Benutzername und/oder Passwort ist ungültig.');
}