$(document).on('pagebeforeshow', '#teams', function() {
    listTeams();
});

function listTeams() {
    $('tbody#teamList').empty();
    get('teams', function(data) {
        debug(data);
        data.forEach(function(team) {
            memberId = memberIdOfUser(team.Members);
            if (memberId > 0) {
                var content =
                    '<tr>' +
                    '<td>' + team.Name + '</td>' +
                    '<td><a href="' + team.Website + '" target="_blank">' + team.Website + '</a></td>' +
                    '<td>Ja<button onclick="austritt(' + memberId + ')">Austreten</button></td>' +
                    '<td><a href="#team-members?id=' + team.TeamId + '">Mitglieder</a></td>' +
                    '<td><a href="#team-edit?id=' + team.TeamId + '" data-role="button" data-icon="edit" data-iconpos="notext" data-theme="c" data-inline="true">Edit</a></td>' +
                    '</tr>';
            } else {
                var content =
                    '<tr>' +
                    '<td>' + team.Name + '</td>' +
                    '<td><a href="' + team.Website + '" target="_blank">' + team.Website + '</a></td>' +
                    '<td>Nein<button onclick="beitritt(' + team.TeamId + ')">Beitreten</button></td>' +
                    '<td><a href="#team-members?id=' + team.TeamId + '">Mitglieder</a></td>' +
                    '<td><a href="#team-edit?id=' + team.TeamId + '" data-role="button" data-icon="edit" data-iconpos="notext" data-theme="c" data-inline="true">Edit</a></td>' +
                    '</tr>';
            }
            $('tbody#teamList').append(content);
        }, this);
    });
}

function beitritt(teamid) {
    postData = '{"UserId": ' + userId + ',"TeamId": ' + teamid + '}';
    post('members', postData, listTeams());
}

function austritt(memberid) {
    del('members/' + memberid, listTeams());
}

$(document).on('pagebeforeshow', '#team-members', function(e, data) {
    if ($.mobile.pageData && $.mobile.pageData.id) {
        listMembers($.mobile.pageData.id);
    }
});

function listMembers(teamid) {
    $('tbody#teamMembers').empty();
    get('teams/' + teamid, function(data) {
        debug(data[0]);
        if (data[0]) {
            data[0].Members.forEach(function(member) {
                get('users/' + member.UserId, function(data) {
                    debug(data[0]);
                    if (data[0]) {
                        user = data[0];
                        var content =
                            '<tr>' +
                            '<td>' + user.FirstName + '</td>' +
                            '<td>' + user.LastName + '</td>' +
                            '</tr>';
                        $('tbody#teamMembers').append(content);
                    }
                });
            });
        }
    });
};

function memberIdOfUser(members) {
    let memberId = 0;
    members.forEach(function(member) {
        if (member.UserId == userId) {
            return memberId = member.MemberId;
        }
    });
    return memberId;
}