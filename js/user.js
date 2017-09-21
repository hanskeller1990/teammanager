/**
 * Contains user specific functions
 * @class User
 */

/**
 * username for all api calls
 * @property username
 */
/**
 * password for all api calls
 * @property password
 * @type string
 */
/**
 * userId of the logged in user
 * @property userId
 * @type number
 */
var username, password, userId;

/**
 * checks if the username, password and userId is set
 * if not checks also in localStorage
 * if still not, redirects to login page
 * @event pagebeforechange
 */
$(document).bind('pagebeforechange', function() {
    if (window.location.hash !== '#login' && window.location.hash !== '#signup') {
        if (!username || !password || !userId) {
            username = localStorage.getItem('username');
            password = localStorage.getItem('password');
            userId = localStorage.getItem('userId');
            if (!username || !password || !userId) {
                window.location.hash = 'login';
            }
        }
    }
});

/**
 * calls {{#crossLink "User/showUser:method"}}{{/crossLink}} if page settings is loaded
 * @event pagebeforeshow
 * @param settings
 */
$(document).on('pagebeforeshow', '#settings', function() {
    showUser();
});

/**
 * gets User data and puts it info the page
 * @method showUser
 */
function showUser() {
    get('users/' + userId, function(data) {
        console.debug(data[0]);
        if (data[0]) {
            user = data[0];
            $('#txt-settings-firstname').val(user.FirstName);
            $('#txt-settings-lastname').val(user.LastName);
            $('#txt-settings-mail').val(user.Email);
        }
    });
}

/**
 * gets User data from page and makes a put request to change user data
 * @method change
 */
function change() {
    firstname = $('#txt-settings-firstname').val();
    lastname = $('#txt-settings-lastname').val();
    mail = $('#txt-settings-mail').val();

    if (firstname === '' || lastname === '' || mail === '') {
        popup('settings-popup', 'Fehlende Angaben', 'Bitte füllen Sie alle Felder aus.', 2000);
        return;
    }

    putData = '{' +
        '"LastName": "' + lastname + '",' +
        '"FirstName": "' + firstname + '",' +
        '"Email": "' + mail + '"' +
        '}';
    put('users/' + userId, putData, function(data) {
        if (noError(data)) {
            popup('settings-popup', 'Erfolg', 'Daten erfolgreich geändert', 2000);
            localName = localStorage.getItem('username')
            if (localName && localName !== mail) {
                localStorage.setItem('username', mail);
            }
        } else {
            popup('settings-popup', data.type, data.message, 2000);
        }
    });
}

/**
 * gets User password from page and makes a put request to change the password
 * @method changePW
 */
function changePW() {
    password = $('#txt-settings-password').val();
    passwordConfirm = $('#txt-settings-password-confirm').val();

    if (password === '' || passwordConfirm === '') {
        popup('settings-popup', 'Fehlende Angaben', 'Bitte füllen Sie alle Felder aus.', 2000);
        return;
    }
    if (password !== passwordConfirm) {
        popup('settings-popup', 'Fehler', 'Die Beiden Passwörter stimmen nicht überein', 2000);
        return;
    }
    putData = '{' +
        '"Password": "' + password + '"' +
        '}';
    put('users/' + userId, putData, function(data) {
        if (noError(data)) {
            popup('settings-popup', 'Erfolg', 'Passwort erfolgreich geändert', 2000);
            localPW = localStorage.getItem('password')
            if (localPW && localPW !== password) {
                localStorage.setItem('password', password);
            }
        } else {
            popup('settings-popup', data.type, data.message, 2000);
        }
    });
}

/**
 * gets username and password from page and makes a call to get all users
 * to check if the provided data is valid and to
 * iterate over them to get the userId of the logged in user
 * if checkbox is checked, data passed is saved to localStorage for future sessions
 * @method login
 */
function login() {
    username = $('#txt-login-username').val();
    password = $('#txt-login-password').val();
    saveCredentials = $('#chck-login-rememberme').is(':checked');
    if (username === '' || password === '') {
        popup('login-popup', 'Fehlende Angaben', 'Bitte füllen Sie alle Felder aus.', 2000);
        return;
    }
    // get('users?Email=' + username + ')', function(data) {
    get('users', function(data) {
        console.debug(data);
        if (!noError(data)) {
            popup('login-popup', data.type, data.message, 2000);
            return;
        }
        data.forEach(function(user) {
            if (user.Email === username) {
                userId = user.UserId;
                if (saveCredentials) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                    localStorage.setItem('userId', userId);
                }
                window.location.hash = '';
                return
            }
        });
    });
}

/**
 * gets data from form and tries to register a new user with it
 * @method signup
 */
function signup() {
    firstname = $('#txt-signup-firstname').val();
    lastname = $('#txt-signup-lastname').val();
    mail = $('#txt-signup-mail').val();
    password = $('#txt-signup-password').val();
    passwordConfirm = $('#txt-signup-password-confirm').val();

    if (firstname === '' || lastname === '' || mail === '' || password === '' || passwordConfirm === '') {
        popup('signup-popup', 'Fehlende Angaben', 'Bitte füllen Sie alle Felder aus.', 2000);
        return;
    }
    if (password.length < 8) {
        popup('signup-popup', 'Fehler', 'Das Passwort muss mindestens 8 Zeichen lang sein', 2000);
        return;
    }
    if (password !== passwordConfirm) {
        popup('signup-popup', 'Fehler', 'Die Beiden Passwörter stimmen nicht überein', 2000);
        return;
    }
    postData = '{' +
        '"LastName": "' + lastname + '",' +
        '"FirstName": "' + firstname + '",' +
        '"Email": "' + mail + '",' +
        '"Password": "' + password + '"' +
        '}';
    post('register', postData, function(data) {
        if (noError(data)) {
            popup('signup-popup', data.type, data.message, 2000);
            $.mobile.changePage('#login');
        } else {
            popup('signup-popup', data.type, data.message, 2000);
        }
    });
}

function logout(auto) {
    username,
    password,
    userId = '';
    localStorage.clear();
    if (auto) {
        $.mobile.changePage('#login?logout=auto');
    } else {
        $.mobile.changePage('#login');
    }
}