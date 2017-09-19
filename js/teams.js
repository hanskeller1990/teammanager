$(document).on('pagebeforeshow', '#teams', function() {
    listTeams('teamList');
});

$(document).on('pagebeforeshow', '#ownTeams', function() {
    listTeams('ownTeamList', true);
});

function listTeams(id, own) {
    $('tbody#' + id).empty();
    get('teams', function(data) {
        debug(data);
        data.forEach(function(team) {
            memberId = memberIdOfUser(team.Members);
            if (!own || (own && memberId > 0)) {
                var content =
                    '<tr>' +
                    '<td>' + team.Name + '</td>' +
                    '<td><a href="' + team.Website + '" target="_blank">' + team.Website + '</a></td>';
                if (memberId > 0) {
                    content +=
                        '<td><button class="ui-btn ui-shadow ui-corner-all" onclick="austritt(' + memberId + ')">Austreten</button></td>';
                } else {
                    content +=
                        '<td><button class="ui-btn ui-shadow ui-corner-all" onclick="beitritt(' + team.TeamId + ')">Beitreten</button></td>';
                }
                content +=
                    '<td><a href="#team-edit?teamId=' + team.TeamId + '" data-role="button" data-icon="edit" data-iconpos="notext" ' +
                    'data-theme="c" data-inline="true" class="ui-link ui-btn ui-btn-c ui-icon-edit ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all">Edit</a></td>' +
                    '</tr>';
            }
            $('tbody#' + id).append(content);
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

$(document).on('pagebeforeshow', '#team-edit', function(e, data) {
    if ($.mobile.pageData) {
        getTeamDetail($.mobile.pageData.teamId);
    } else {
        getTeamDetail();
    }
});

function getTeamDetail(teamid) {
    if (teamid) {
        getTeam(teamid, function(team) {
            showTeamDetail(team, team.OwnerId)
        });
    } else {
        showTeamDetail({}, userId)
    }
}

function showTeamDetail(team, ownerId) {
    get('users/' + ownerId, function(data) {
        if (data[0]) {
            $('#number-team-id').val(team.TeamId);
            $('#txt-team-owner').val(data[0].FirstName + ' ' + data[0].LastName);
            $('#txt-team-name').val(team.Name);
            $('#txt-team-website').val(team.Website);
            if (team.Members && memberIdOfUser(team.Members) > 0) {
                $('#chck-team-member').attr('checked', true).checkboxradio('refresh');
            }
        }
    });
    if (team.TeamId) {
        $('#btn-team-delete').show();
        $('#teamDetailMembers').show();
        listMembers(team.Members);
    } else {
        $('#btn-team-delete').hide();
        $('#teamDetailMembers').hide();
    }
}

function getTeam(teamid, successFn) {
    get('teams/' + teamid, function(data) {
        debug(data[0]);
        if (data[0]) {
            successFn(data[0]);
        }
    });
}


function listMembers(members) {
    $('tbody#teamMembers').empty();
    members.forEach(function(member) {
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
};


function saveTeam() {
    let team = {};
    team.TeamId = $('#number-team-id').val();
    team.Name = $('#txt-team-name').val();
    team.Website = $('#txt-team-website').val();
    // if (team.Members && memberIdOfUser(team.Members) > 0) {
    //     $('#chck-team-member').attr('checked', true).checkboxradio('refresh');
    // }
    if (!team.TeamId) {
        team.OwnerId = userId;
        post('teams', JSON.stringify(team), function(data) {
            $.mobile.changePage('#teams');
        });
    } else {
        put('teams/' + team.TeamId, JSON.stringify(team), function(data) {
            debug(data);
        });
    }
}

function deleteTeam() {
    teamId = $('#number-team-id').val();
    del('teams/' + teamId, function(data) {
        $.mobile.changePage('#teams');
    });
}


function memberIdOfUser(members) {
    let memberId = 0;
    members.forEach(function(member) {
        if (member.UserId == userId) {
            return memberId = member.MemberId;
        }
    });
    return memberId;
}

function ownTeams(teams) {
    let ownTeams = [];
    teams.forEach(function(team) {
        if (team.OwnerId == userId) {
            ownTeams.push(team);
        }
    });
    return ownTeams;
}