$(document).on('pagebeforeshow', '#trainings', function() {
    listTrainings();
});

$(document).on('pagebeforeshow', '#own-teams-trainings', function() {
    listOwnTeamsTrainings();
});

$(document).on('pagebeforeshow', '#training-edit', function() {
    ();
});

var teams;

function listTrainings() {
    $('tbody#trainingsList').empty();
    teams = [];
    get('trainings', function(data) {
        debug(data);
        if (noError(data)) {
            data.forEach(function(training) {
                if (!teams[training.TeamId]) {
                    get('teams/' + training.TeamId, function(data) {
                        if (noError(data)) {
                            teams[training.TeamId] = data[0];
                            writeTrainingsEntry('trainingsList', training);
                        }
                    });
                } else {
                    writeTrainingsEntry('trainingsList', training);
                }
            });
        }
    });
}

function listOwnTeamsTrainings() {
    $('tbody#teamTrainingsList').empty();
    teams = [];
    get('trainings', function(data) {
        debug(data);
        if (noError(data)) {
            data.forEach(function(training) {
                if (!teams[training.TeamId]) {
                    get('teams/' + training.TeamId, function(data) {
                        if (noError(data)) {
                            teams[training.TeamId] = data[0];
                            memberId = memberIdOfUser(data[0].Members);
                            if (memberId > 0) {
                                writeTrainingsEntry('teamTrainingsList', training);
                            }
                        }
                    });
                } else {
                    memberId = memberIdOfUser(teams[training.TeamId].Members);
                    if (memberId > 0) {
                        writeTrainingsEntry('teamTrainingsList', training);
                    }
                }
            });
        }
    });
}

function getTrainingDetail(trainingId) {
    if (trainingId) {
        getTraining(trainingId, function(training) {
            showTrainingDetail(training, training.TeamId)
        });
    } else {
        showTrainingDetail({}, userId)
    }
}

function getTraining(trainingId, successFn) {
    get('trainings/' + trainingId, function(data) {
        debug(data[0]);
        if (data[0]) {
            successFn(data[0]);
        }
    });
}

function showTrainingDetail(training, teamId) {
    get('teams/' + teamId, function(data) {
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
    } else {
        $('#btn-team-delete').hide();
    }
}

function anmelden(trainingId) {
    postData = '{"UserId": ' + userId + ',"TrainingId": ' + trainingId + '}';
    callback = listTrainings();
    if (window.location.hash === '#own-teams-trainings') {
        callback = listOwnTeamsTrainings();
    }
    post('participants', postData, callback);
}

function abmelden(memberid) {
    callback = listTrainings();
    if (window.location.hash === '#own-teams-trainings') {
        callback = listOwnTeamsTrainings();
    }
    del('participants/' + memberid, callback);
}

function writeTrainingsEntry(id, training) {
    participantId = participantIdOfUser(training.Participants);
    if (participantId > 0) {
        var content =
            '<tr>' +
            '<td>' + training.Title + '</td>' +
            '<td>' + teams[training.TeamId].Name + '</td>' +
            '<td>' + training.Date + '</td>' +
            '<td>Ja<button onclick="abmelden(' + participantId + ')">Abmelden</button></td>' +
            '<td>' + training.Participants.length + '</td>' +
            '</tr>';
    } else {
        var content =
            '<tr>' +
            '<td>' + training.Title + '</td>' +
            '<td>' + teams[training.TeamId].Name + '</td>' +
            '<td>' + training.Date + '</td>' +
            '<td>Nein<button onclick="anmelden(' + training.TrainingId + ')">Anmelden</button></td>' +
            '<td>' + training.Participants.length + '</td>' +
            '</tr>';
    }

    $('tbody#' + id).append(content);
}

function participantIdOfUser(participants) {
    let participantId = 0;
    participants.forEach(function(participant) {
        if (participant.UserId == userId) {
            return participantId = participant.ParticipantId;
        }
    });
    return participantId;
}