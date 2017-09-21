/**
 * calls {{#crossLink "Teams/listTeams:method"}}{{/crossLink}} if page teams is loaded
 * @event team list load
 */
$(document).on('pagebeforeshow', '#teams', function() {
    listTeams('teamList');
});

/**
 * calls {{#crossLink "Teams/listTeams:method"}}{{/crossLink}} if page oenTeams is loaded
 * @event own team list load
 */
$(document).on('pagebeforeshow', '#ownTeams', function() {
    listTeams('ownTeamList', true);
});

/**
 * get all teams and put his on the page table, If need to shown only the own teams needs the parameter
 * own of true otherwise of false
 * @method listTeams
 * @param id {string} page table id
 * @param own {boolean} shows only the own Teams
 */
function listTeams(id, own) {
    $('tbody#' + id).empty();
    get('teams', function(data) {
        console.debug(data);
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
/**
 * sets the selected team status to joined
 * @method beitritt
 * @param teamid {string} team id from the selected team
 */
function beitritt(teamid) {
    postData = '{"UserId": ' + userId + ',"TeamId": ' + teamid + '}';
    post('members', postData, function(data) { listTeams('teamList') });
}


/**
 * sets the selected team status to deny
 * @method austritt
 * @param teamid {string} team id from the selected team
 */
function austritt(memberid) {
    del('members/' + memberid, function(data) { listTeams('teamList') });
}

/**
 * check pageData is null
 * null = get empty team details
 * not null = get team detail from team id
 * @event pagebeforeshow
 */
$(document).on('pagebeforeshow', '#team-edit', function(e, data) {
    if ($.mobile.pageData) {
        getTeamDetail($.mobile.pageData.teamId);
    } else {
        getTeamDetail();
    }
});

/**
 * Get team details from teamid (null = new team)
 * Change header for new team or edit tem
 * @method getTeamDetails
 * @param teamid {string} team id from which we need the detail data
 */
function getTeamDetail(teamid) {
    if (teamid) {
        $("#teamEditHeader").text("Team bearbeiten");
        getTeam(teamid, function(team) {
            showTeamDetail(team, team.OwnerId)
        });
    } else {
        $("#teamEditHeader").text("Neues Team erstellen");
        showTeamDetail({}, userId)
    }
}

/**
 * fills all page fields with the information from the team object
 * also fills all team members to the page table if the TeamId not null, otherwise will hide this page table
 * @method showTeamDetails
 * @param ownerid {string} user id from the team owner
 * @param team {object} all information from the team
 */
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

/**
 * get method for team details
 * @method getTeam
 * @param teamid {string} team id from which we need the detail data
 * @param successFN {function} callback function
 */
function getTeam(teamid, successFn) {
    get('teams/' + teamid, function(data) {
        console.debug(data[0]);
        if (data[0]) {
            successFn(data[0]);
        }
    });
}

/**
 * get method to make the team member list on the page (Firstname and Lastname)
 * @method listMembers
 * @param members {Object Array} Array from object member
 */
function listMembers(members) {
    $('tbody#teamMembers').empty();
    members.forEach(function(member) {
        get('users/' + member.UserId, function(data) {
            console.debug(data[0]);
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

/**
 * get value from page fields and put or post all team information to the server api as JSON to save this values
 * PUT for modified team and POST for a new Team
 * @method saveTeam
 */
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
            console.debug(data);
        });
    }
}

/**
 * Delete the selected team and call the del method to send this to the server api
 * @method deleteTeam
 */
function deleteTeam() {
    teamId = $('#number-team-id').val();
    del('teams/' + teamId, function(data) {
        $.mobile.changePage('#teams');
    });
}

/**
 * Check if the actual user in the member list and return 0 oder the memberid
 * @method memberIdOfUser
 * @param members {Array} Array of member objects
 * @return memberid {string} the own member id from the team if the user not member return 0
 */
function memberIdOfUser(members) {
    let memberId = 0;
    members.forEach(function(member) {
        if (member.UserId == userId) {
            return memberId = member.MemberId;
        }
    });
    return memberId;
}

/**
 * Check all own teams from the aczual user and return this as list
 * @method ownTeams
 * @param teams {Array} Array of team objects
 * @return ownTeams {Array} Array from team objects
 */
function ownTeams(teams) {
    let ownTeams = [];
    teams.forEach(function(team) {
        if (team.OwnerId == userId) {
            ownTeams.push(team);
        }
    });
    return ownTeams;
}