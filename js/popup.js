/**
 * @class Popup
 */

/**
 * Method for showing messages inside a popup div
 * @method popup
 * @param id {string} id of the popup div
 * @param title {string} title to be shown as header
 * @param text {string} text to be shown
 * @param  timeout {number} ms before auto closing
 */

function popup(id, title, text, timeout) {
    $('#' + id + '-title').text(title)
    $('#' + id + '-text').text(text)
    $('#' + id).popup('open');
    setTimeout(function() { $('#' + id).popup('close'); }, timeout);
}