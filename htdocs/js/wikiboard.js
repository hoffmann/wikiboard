var converter = new Showdown.converter();

function set_content(){

    var data = $('#raw').text()
    var html = converter.makeHtml(data);
    $('#content').html(html);
}


$(document).ready(function() {
    set_content();
});

