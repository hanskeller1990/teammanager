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
    assert.notOk(noError(object))
});
QUnit.test('test noError error message', function(assert) {
    let object = {};
    object.type = 'Error';
    assert.notOk(noError(object))
});
QUnit.test('test shouldBe401 401', function(assert) {
    let object = {};
    object.type = 'Warning';
    object.message = 'Benutzername und/oder Passwort ist ungültig.'
    assert.ok(shouldBe401(object))
});
QUnit.test('test shouldBe401 some data', function(assert) {
    let object = {};
    object.type = 'Error';
    assert.notOk(shouldBe401(object))
});