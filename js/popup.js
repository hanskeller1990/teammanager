function popup(id, title, text, timeout) {
    $('#' + id + '-title').text(title)
    $('#' + id + '-text').text(text)
    $('#' + id).popup('open');
    setTimeout(function() { $('#' + id).popup('close'); }, timeout);
}