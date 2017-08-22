/**
 * Created by hk on 22.08.2017.
 */
$(document).ready(function () {
    receiveMembers();
});

function receiveMembers() {
    call('users', function(data){
        console.log(data);
        data.forEach(function(user) {
            var content = '<li onclick="memberDetail('+ user.UserId +')">' + user.FirstName + ' ' + user.LastName + '</li>';
            $('ul#memberlist').append(content);
        }, this);
    });
}

function memberDetail(id) {
    storeObject.id = id;
    //Change page
    $.mobile.changePage("#members-detail");
}

var storeObject = {
    id: 0
}

$(document).on('pagebeforeshow', '#members-detail', function(){     
    $('#test').text(storeObject.id)
});


var basePath = 'https://zbw.lump.ch/api/v1';

function call(path, successFn) {
    if(path.indexOf('/') != 0) {
        path = '/'+path
    }
    $.ajax({
        type: 'GET',
        url: basePath+path,
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ('Authorization', 'Basic ' + btoa('livio.a@gmail.com' + ":" + 'test1234'));
        },
        success: successFn
    });
}