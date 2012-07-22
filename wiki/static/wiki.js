(function($) {
        $.fn.relativeDate = function() {
                $(this).bind('relativeDate', function() {
                        var t = $(this).attr('datetime'),
                                d = new Date(t.substr(0,4)+' '+t.substr(5,2)+' '+t.substr(8,2)+','+t.substr(11,2)+':'+t.substr(14,2)+':'+t.substr(17,2)),
                                delta = Math.floor(((now = new Date()).getTime() - d.getTime())/1000); // in seconds
                        if (delta < 120)
                                $(this).text('1m');
                        else if (delta >= 120 && delta < 60*60)
                                $(this).text(Math.floor(delta/60)+'m');
                        else if (delta >= 60*60 && delta < 60*60*2)
                                $(this).text(Math.floor(delta/(60*60))+'h');
                        else if (delta >= 60*60*2 && delta < 60*60*24)
                                $(this).text(Math.floor(delta/(60*60))+'h');
                        else if (delta >= 60*60*24 && delta < 60*60*24*2)
                                $(this).text('1d');
                        else if (delta >= 60*60*24 && delta < 60*60*24*30)
                                $(this).text(Math.floor(delta/(60*60*24))+'d');
                        else
                                $(this).text(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]+' '+d.getDate()); //+', '+d.getFullYear());
                }).trigger('relativeDate');
                var $this = $(this);
                setInterval(function() { $this.trigger('relativeDate'); }, 10000);
                return $(this);
        };
})(jQuery);


// Escape a string for HTML interpolation.
var escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };


function Wiki(){
    var that = this;
    this.result = [];
    this.selected = 0;

    this.search = function(){
        var q = $('input#q')[0].value
        $.get('/item/', {q: q},  that.set_search_result)
        $('input#q').blur();
        return false;
    } 

    this.set_search_result = function(data){
        var html = "";
        that.result = [];
        that.selected = 0;

        for (var i =  0; i <data.items.length; i++) {
              var id = data.items[i].sha1;
              that.result.push(id);
              var created_at = data.items[i].created_at;
              var title = data.items[i].title;
              var snippet = data.items[i].snippet;

              html += "<div id=\""+escape(id)+"\"><b>"+escape(title)+"</b>";
              html += "<time datetime=\""+escape(created_at)+"\"></time>";
              html +="<br>\n"+escape(snippet)+"</div>\n";
        };
        $('#result').html(html);
        $('#result time').relativeDate();
        $('#result div').click(function () {
          that.set($(this).attr('id'));
        });

        that.show();
    }

    this.clear_selected = function(){
      $('#result div#'+this.result[this.selected]).removeClass('selected');
    }
 
    this.show = function(){
        var current = that.result[that.selected];
        $('#result div#'+current).addClass('selected');
        $.get('/item/'+current, function(data){
            $('h1#title').text(data.title);
            var html = marked(data.content);
            $('div#content article').html(html);
            $('div#content pre code').each(function(i, e) {
                return hljs.highlightBlock(e);
            });
        });
        $('#result').scrollTop(0);
        $('#result').scrollTop($("#" + current).offset().top - 58);
    }  
    this.next = function(){
        that.clear_selected();
        that.selected = that.selected < that.result.length -1 ? that.selected + 1 : that.result.length -1;
        that.show();
    }
    this.prev = function(){
        that.clear_selected();
        that.selected = that.selected > 0 ? that.selected - 1 : 0;
        that.show();
    }

    this.set = function(sha1){
        that.clear_selected();
        that.selected = that.result.indexOf(sha1) > 0 ? that.result.indexOf(sha1) :0;
        that.show();
    }



}


$(document).ready(function(){
    var wiki = new Wiki();
    $('#result').css("height",$('#left').height() - 80);
    Mousetrap.bind("j", wiki.next);
    Mousetrap.bind("k", wiki.prev);

    var gosearch = function() {
        $('input#q').focus();
        $('input#q').select();
    };
    Mousetrap.bind("7", gosearch, 'keyup');
    Mousetrap.bind("/", gosearch, 'keyup');
    Mousetrap.bind("shift+/", gosearch, 'keyup');

    //Bind Callbacks
    $('form[name="search"]').submit(wiki.search);

    wiki.search();
});
