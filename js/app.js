/**
 * Created by hk on 22.08.2017.
 */
// $(document).ready(function() {
//     receiveMembers();
// });

function receiveMembers() {
    get('users', function(data) {
        console.log(data);
        data.forEach(function(user) {
            var content = '<li onclick="memberDetail(' + user.UserId + ')">' + user.FirstName + ' ' + user.LastName + '</li>';
            $('ul#memberlist').append(content);
        }, this);
    });
}

function memberDetail(id) {
    // storeObject.id = id;
    //Change page
    $.mobile.changePage("#members-detail?id=" + id);
}
$(document).on('pagebeforeshow', '#members-detail', function(e, data) {
    if ($.mobile.pageData && $.mobile.pageData.id) {
        getMemberDetail($.mobile.pageData.id);
    }
});

function getMemberDetail() {
    get('users', function(data) {
        console.log(data);
        data.forEach(function(user) {
            var content = '<li onclick="memberDetail(' + user.UserId + ')">' + user.FirstName + ' ' + user.LastName + '</li>';
            $('ul#memberlist').append(content);
        }, this);
    });
}

$(document).bind("pagebeforechange", function(event, data) {
    $.mobile.pageData = (data && data.options && data.options.pageData) ?
        data.options.pageData :
        null;
});

var basePath = 'https://zbw.lump.ch/api/v1';


UserId = 133;


function get(path, successFn) {
    call(path, null, successFn, 'GET');
}

function post(path, data, successFn) {
    call(path, data, successFn, 'POST');
}

function del(path, successFn) {
    call(path, null, successFn, 'DELETE');
}

function call(path, postData, successFn, method) {
    if (path.indexOf('/') != 0) {
        path = '/' + path
    }
    $.ajax({
        type: method,
        url: basePath + path,
        data: postData,
        dataType: 'json',
        beforeSend: function(xhr) {
            // xhr.setRequestHeader('Authorization', 'Basic ' + btoa('livio.a@gmail.com' + ":" + 'test1234'));
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));
        },
        success: successFn
    });
}