/**
 * Created by hk on 22.08.2017.
 */
$(document).ready(function () {
    receiveMembers();
});

function receiveMembers() {
    $.ajax({
        url: "https://zbw.lump.ch/api/v1/users",
        username: 'hans.keller@optimatik.ch',
        password: 'HelloWorld17',
        success: function(){
            console.log("test");
        }
    });
}