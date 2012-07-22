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


