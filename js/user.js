var username, password, userId;

$(document).bind("pagebeforechange", function(event, data) {
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


function login() {
    username = $('#txt-username').val();
    password = $('#txt-password').val();
    saveCredentials = $('#chck-rememberme').is(':checked');
    if (username === '' || password === '') {
        popup("login-popup", "Fehlende Angaben", "Bitte füllen Sie alle Felder aus.", 2000);
        return;
    }
    // get('users?Email=' + username + ')', function(data) {
    get('users', function(data) {
        debug(data);
        if (noError(data)) {
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
        }
        popup("login-popup", data.type, data.message, 2000);
        return;
    });
}

function signup() {
    firstname = $('#txt-firstname').val();
    lastname = $('#txt-lastname').val();
    mail = $('#txt-mail').val();
    password = $('#txt-password-one').val();
    passwordConfirm = $('#txt-password-confirm').val();

    if (firstname === '' || lastname === '' || mail === '' || password === '' || passwordConfirm === '') {
        popup("signup-popup", "Fehlende Angaben", "Bitte füllen Sie alle Felder aus.", 2000);
        return;
    }
    if (password !== passwordConfirm) {
        popup("signup-popup", "Fehler", "Die Beiden Passwörter stimmen nicht überein", 2000);
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

        } else {
            popup("signup-popup", data.type, data.message, 2000);
        }
    });
}