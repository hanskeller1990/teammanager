var username, password, userId;

function login() {
    username = $('#txt-username').val();
    password = $('#txt-password').val();
    if (username === '' || password === '') {

    }
    // get('users?Email=' + username + ')', function(data) {
    get('users', function(data) {
        debug(data);
        if (noError(data)) {
            data.forEach(function(user) {
                if (user.Email === username) {
                    userId = user.UserId;
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
            window.location.hash = 'login';
        }
    }
});