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
    $.mobile.changePage('#members-detail?id=' + id);
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

$(document).bind('pagebeforechange', function(event, data) {
    $.mobile.pageData = (data && data.options && data.options.pageData) ?
        data.options.pageData :
        null;
});

$(function() {    
    $("[data-role='navbar']").navbar();    
    $("[data-role='header'], [data-role='footer']").toolbar();
});
// Update the contents of the toolbars
$(document).on('pagecontainerchange', function(event, data) { 
    var current = window.location.hash;
    $("[data-role='navbar'] a.ui-btn-active").removeClass("ui-btn-active");
    $("[data-role='navbar'] a").each(function() {
        if ($(this).attr('href') === current) {
            $(this).addClass("ui-btn-active");
        }
    });
});

var basePath = 'https://zbw.lump.ch/api/v1';


function get(path, successFn) {
    call(path, null, successFn, 'GET');
}

function post(path, data, successFn) {
    call(path, data, successFn, 'POST');
}

function put(path, data, successFn) {
    call(path, data, successFn, 'PUT');
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
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
        },
        success: successFn
    });
}