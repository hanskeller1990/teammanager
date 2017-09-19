function noError(data) {
    if (data.type) {
        if (data.type === 'Info') {
            return true;
        }
        return false;
    }
    return true;
}

function shouldBe401(data) {
    return (data.type && data.type === 'Warning' && data.message === 'Benutzername und/oder Passwort ist ungültig.');
}