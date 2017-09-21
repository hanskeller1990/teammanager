var username, password, userId;

$(document).bind('pagebeforechange', function(event, data) {
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


$(document).on('pagebeforeshow', '#settings', function() {
    showUser();
});


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