/**
 * Contains generall functions
 * @class App
 */

/**
 * basePath for all api calls
 * @property basePath
 * @type string
 * @default https://zbw.lump.ch/api/v1
 */
var basePath = 'https://zbw.lump.ch/api/v1';


/**
 * sets the navbar (on the home page) to the navbar of the whole site
 * @event document load
 */
$(function() {    
    $("[data-role='navbar']").navbar();    
    $("[data-role='header'], [data-role='footer']").toolbar();
});

/**
 * ensures that the current page is higlighted in the navbar
 * @event pagecontainerchange
 */
$(document).on('pagecontainerchange', function(event, data) { 
    var current = window.location.hash;
    $("[data-role='navbar'] a.ui-btn-active").removeClass("ui-btn-active");
    $("[data-role='navbar'] a").each(function() {
        if ($(this).attr('href') === current || (current === '' && $(this).attr('href') === '#home')) {
            $(this).addClass("ui-btn-active");
        }
    });
});

/**
 * function to pass data between pages
 * @event pagebeforechange
 */
$(document).bind('pagebeforechange', function(event, data) {
    $.mobile.pageData = (data && data.options && data.options.pageData) ?
        data.options.pageData :
        null;
});

/**
 * GET method for the api
 * @method get
 * @param path {string} location extending basePath
 * @param successFn {function} callback function
 */
function get(path, successFn) {
    call(path, null, successFn, 'GET');
}

/**
 * POST method for the api
 * @method post
 * @param path {string} location extending basePath
 * @param data data for the request (JSON)
 * @param successFn {function} callback function
 */
function post(path, data, successFn) {
    call(path, data, successFn, 'POST');
}

/**
 * PUT method for the api
 * @method put
 * @param path {string} location extending basePath
 * @param data data for the request (JSON)
 * @param successFn {function} callback function
 */
function put(path, data, successFn) {
    call(path, data, successFn, 'PUT');
}

/**
 * DELETE method for the api
 * @method del
 * @param path {string} location extending basePath
 * @param successFn {function} callback function
 */
function del(path, successFn) {
    call(path, null, successFn, 'DELETE');
}

/**
 * calls the api with provided data and passes return data to callback function
 * @method call
 * @private
 * @param path {string} location extending basePath
 * @param postData data for post and put requests
 * @param successFn {function} callback function
 * @param method {string} HTTP Method
 */
function call(path, postData, successFn, method) {
    if (path.indexOf('/') != 0) {
        path = '/' + path
    }
    $.ajax({
        type: method,
        url: basePath + path,
        data: postData,
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
        },
        statusCode: {
            200: function(data) {
                if (shouldBe401(data)) {
                    if (window.location.hash !== '#login&ui-state=dialog') {
                        logout(true);
                    }
                } else {
                    successFn(data);
                }
            }
        }
    });
}