$(document).on('pagebeforeshow', '#trainings', function() {
    listTrainings();
});

$(document).on('pagebeforeshow', '#own-teams-trainings', function() {
    listOwnTeamsTrainings();
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

function anmelden(trainingId) {
    postData = '{"UserId": ' + UserId + ',"TrainingId": ' + trainingId + '}';
    post('participants', postData, listTrainings());
}

function abmelden(memberid) {
    del('participants/' + memberid, listTrainings());
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
        if (participant.UserId == UserId) {
            return participantId = participant.ParticipantId;
        }
    });
    return participantId;
}