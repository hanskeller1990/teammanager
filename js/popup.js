/**
 * @class popup
 */

/**
 * Method for showing messages inside a popup div
 * @method popup
 * @param {*id of the popup div} id 
 * @param {* title to be shown as header} title 
 * @param {* text to be shown} text 
 * @param {* timeout before auto closing} timeout 
 */

function popup(id, title, text, timeout) {
    $('#' + id + '-title').text(title)
    $('#' + id + '-text').text(text)
    $('#' + id).popup('open');
    setTimeout(function() { $('#' + id).popup('close'); }, timeout);
}