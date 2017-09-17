var username, password, userId;

function login() {
    username = $('#txt-username').val();
    password = $('#txt-password').val();
    saveCredentials = $('#chck-rememberme').is(':checked');
    if (username === '' || password === '') {

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
    });
}

$(document).bind("pagebeforechange", function(event, data) {
    if (window.location.hash !== '#login') {
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