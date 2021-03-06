/**
 * Contains trainings specific functions
 * @class Training
 */

/**
 * calls {{#crossLink "Training/listTrainings:method"}}{{/crossLink}} if page trainings is loaded
 * @event pagebeforeshow
 * @param trainings
 */
$(document).on('pagebeforeshow', '#trainings', function() {
    listTrainings();
});

/**
 * calls {{#crossLink "Training/listOwnTeamsTrainings:method"}}{{/crossLink}} if page own-teams-trainings is loaded
 * @event pagebeforeshow
 * @param own-teams-trainings
 */
$(document).on('pagebeforeshow', '#own-teams-trainings', function() {
    listOwnTeamsTrainings();
});
/**
 * calls {{#crossLink "Training/listOwnTrainings:method"}}{{/crossLink}} if page ownTrainings is loaded
 * @event pagebeforeshow
 * @param ownTrainings
 */
$(document).on('pagebeforeshow', '#ownTrainings', function() {
    listOwnTrainings();
});


/**
 * calls {{#crossLink "Training/getTrainingDetail:method"}}{{/crossLink}} with parameter passed to page if page training-edit is loaded
 * @event pagebeforeshow
 * @param training-edit
 */
$(document).on('pagebeforeshow', '#training-edit', function(e, data) {
    if ($.mobile.pageData) {
        getTrainingDetail($.mobile.pageData.trainingId);
    } else {
        getTrainingDetail();
    }
});

/**
 * for caching teams
 * @property teams
 * @type Array
 */
var teams;

/**
 * get all trainings
 * @method listTrainings
 */
function listTrainings() {
    $('tbody#trainingsList').empty();
    teams = [];
    get('trainings', function(data) {
        console.debug(data);
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

/**
 * get all Trainings from own Teams
 * @method listOwnTeamsTrainings
 */
function listOwnTeamsTrainings() {
    $('tbody#teamTrainingsList').empty();
    teams = [];
    get('trainings', function(data) {
        console.debug(data);
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

/**
 * get all Trainings the users participating
 * @method listOwnTrainings
 */
function listOwnTrainings() {
    $('tbody#ownTrainingsList').empty();
    teams = [];
    get('trainings', function(data) {
        console.debug(data);
        if (noError(data)) {
            data.forEach(function(training) {
                if (participantIdOfUser(training.Participants) > 0) {
                    if (!teams[training.TeamId]) {
                        get('teams/' + training.TeamId, function(data) {
                            if (noError(data)) {
                                teams[training.TeamId] = data[0];
                                writeTrainingsEntry('ownTrainingsList', training);
                            }
                        });
                    } else {
                        writeTrainingsEntry('ownTrainingsList', training);
                    }
                }
            });
        }
    });
}

/**
 * get all trainingsDetails and set the page header to new training or edit training
 * @method getTrainingDetail
 */
function getTrainingDetail(trainingId) {
    if (trainingId) {
        $("#trainingEditHeader").text("Training bearbeiten");
        getTraining(trainingId, function(training) {
            showTrainingDetail(training, training.TeamId)
        });
    } else {
        $("#trainingEditHeader").text("Neues Training erstellen");
        showTrainingDetail({})
    }
}

/**
 * get all trainingsDetails and set the page header to new training or edit training
 * @method getTraining
 * @param trainingId {string} id from the selected training
 * @param successFn {function} callback function
 */
function getTraining(trainingId, successFn) {
    get('trainings/' + trainingId, function(data) {
        console.debug(data[0]);
        if (data[0]) {
            successFn(data[0]);
        }
    });
}

/**
 * fills all page field with the trainings object information
 * if the team id null will hide the delete button on the page
 * @method showTrainingDetail
 * @param training {object} training object with all information
 * @param teamId {string} team id from the selected training
 */
function showTrainingDetail(training, teamId) {
    if (teamId) {
        get('teams/' + teamId, function(data) {
            if (data[0]) {
                $('#number-training-id').val(training.TrainingId);
                $('#cmbx-training-teamid').append('<option value="' + data[0].TeamId + '">' + data[0].Name + '</option>');
                $('#cmbx-training-teamid').selectedIndex = 0;
                $('#cmbx-training-teamid').selectmenu('refresh');
                $('#cmbx-training-teamid').attr('disabled', true);
                $('#txt-training-title').val(training.Title);
                $('#txt-training-date').val(training.Date);
            }
        });
    } else {
        get('teams', function(teams) {
            $('#number-training-id').val(training.TrainingId);
            ownTeams(teams).forEach(function(team) {
                $('#cmbx-training-teamid').append('<option value="' + team.TeamId + '">' + team.Name + '</option>');
            });
            $('#txt-training-title').val(training.Title);
            $('#txt-training-date').val(training.Date);
        });
    }
    if (training.TrainingId) {
        $('#btn-training-delete').show();
    } else {
        $('#btn-training-delete').hide();
    }
}

/**
 * get value from page fields and put or post all training information to the server api as JSON to save this values
 * PUT for modified training and POST for a new training
 * @method saveTraining
 */
function saveTraining() {
    let training = {};
    training.TrainingId = $('#number-training-id').val();
    training.TeamId = $('#cmbx-training-teamid').val();
    training.Title = $('#txt-training-title').val();
    training.Date = $('#txt-training-date').val();
    if (!training.TrainingId) {
        post('trainings', JSON.stringify(training), function(data) {
            $.mobile.changePage('#trainings');
        });
    } else {
        put('trainings/' + training.TrainingId, JSON.stringify(team), function(data) {
            console.debug(data);
        });
    }
}
/**
 * register the selected training for the actual user
 * @method anmelden
 * @param trainingId {string} training id from the selected training
 */
function anmelden(trainingId) {
    postData = '{"UserId": ' + userId + ',"TrainingId": ' + trainingId + '}';
    callback = function(data) { listTrainings() };
    if (window.location.hash === '#own-teams-trainings') {
        callback = function(data) { listOwnTeamsTrainings() };
    }
    post('participants', postData, callback);
}

/**
 * cancel the selected training for the actual user
 * @method abmelden
 * @param trainingId {string} training id from the selected training
 */
function abmelden(memberid) {
    callback = function(data) { listTrainings() };
    if (window.location.hash === '#own-teams-trainings') {
        callback = function(data) { listOwnTeamsTrainings() };
    }
    del('participants/' + memberid, callback);
}

/**
 * add trainings item to the page table with all trainings information
 * @method writeTrainingsEntry
 * @param id {string} page table id
 * @param training {object} training object with all information
 */
function writeTrainingsEntry(id, training) {
    participantId = participantIdOfUser(training.Participants);
    if (participantId > 0) {
        var content =
            '<tr>' +
            '<td>' + training.Title + '</td>' +
            '<td>' + teams[training.TeamId].Name + '</td>' +
            '<td>' + training.Date + '</td>' +
            '<td><button class="ui-btn ui-shadow ui-corner-all" onclick="abmelden(' + participantId + ')">Abmelden</button></td>' +
            '<td>' + training.Participants.length + '</td>' +
            '<td><a href="#training-edit?trainingId=' + training.TrainingId + '" data-role="button" data-icon="edit" data-iconpos="notext" ' +
            'data-theme="c" data-inline="true" class="ui-link ui-btn ui-btn-c ui-icon-edit ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all">Edit</a></td>' +
            '</tr>';
    } else {
        var content =
            '<tr>' +
            '<td>' + training.Title + '</td>' +
            '<td>' + teams[training.TeamId].Name + '</td>' +
            '<td>' + training.Date + '</td>' +
            '<td><button class="ui-btn ui-shadow ui-corner-all" onclick="anmelden(' + training.TrainingId + ')">Anmelden</button></td>' +
            '<td>' + training.Participants.length + '</td>' +
            '<td><a href="#training-edit?id=' + training.TrainingId + '" data-role="button" data-icon="edit" data-iconpos="notext" ' +
            'data-theme="c" data-inline="true" class="ui-link ui-btn ui-btn-c ui-icon-edit ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all">Edit</a></td>' +
            '</tr>';
    }

    $('tbody#' + id).append(content);
}

/**
 * check if the actual user in the this participant list if yes returns the participants id if not returns 0
 * @method participantIdOfUser
 * @param training {Array} Array of participants objects
 * @return participantId {String} participant if from the actual user
 */
function participantIdOfUser(participants) {
    let participantId = 0;
    participants.forEach(function(participant) {
        if (participant.UserId == userId) {
            return participantId = participant.ParticipantId;
        }
    });
    return participantId;
}