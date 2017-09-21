QUnit.module('Module Error');
QUnit.test('test noError some data', function(assert) {
    let object = {};
    object.data = 'some data';
    assert.ok(noError(object))
});
QUnit.test('test noError info message', function(assert) {
    let object = {};
    object.type = 'Info';
    assert.ok(noError(object))
});
QUnit.test('test noError warning message', function(assert) {
    let object = {};
    object.type = 'Warning';
    assert.notOk(noError(object));
});
QUnit.test('test noError error message', function(assert) {
    let object = {};
    object.type = 'Error';
    assert.notOk(noError(object));
});
QUnit.test('test shouldBe401 401', function(assert) {
    let object = {};
    object.type = 'Warning';
    object.message = 'Benutzername und/oder Passwort ist ungültig.'
    assert.ok(shouldBe401(object));
});
QUnit.test('test shouldBe401 some data', function(assert) {
    let object = {};
    object.type = 'Error';
    assert.notOk(shouldBe401(object));
});

QUnit.module('Module Team');
var userId = 2;
QUnit.test('test memberIdOfUser', function(assert) {
    let members = [];
    let member1 = {};
    member1.UserId = 1;
    member1.MemberId = 1;
    members.push(member1);
    let member2 = {};
    member2.UserId = 2;
    member2.MemberId = 2;
    members.push(member2);
    assert.ok(memberIdOfUser(members) == 2);
});
QUnit.test('test memberIdOfUser no id', function(assert) {
    let members = [];
    let member1 = {};
    member1.UserId = 1;
    member1.MemberId = 1;
    members.push(member1);
    assert.ok(memberIdOfUser(members) == 0);
});
QUnit.test('test ownTeams', function(assert) {
    let teams = [];
    let team1 = {};
    team1.TeamId = 1;
    team1.OwnerId = 1;
    teams.push(team1);
    let team2 = {};
    team1.TeamId = 2;
    team2.OwnerId = 2;
    teams.push(team2);
    let team3 = {};
    team1.TeamId = 3;
    team3.OwnerId = 2;
    teams.push(team3);

    let resultTeams = [];
    resultTeams.push(team2);
    resultTeams.push(team3);
    assert.deepEqual(ownTeams(teams), resultTeams);
});