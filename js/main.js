var tracker = new Boba;

  // Track links with data attributes.
  tracker.trackLinks();

  // Track click in the readme.
  tracker.watch("click", ".readme a", function(event) {
    var linkText = $(event.currentTarget).text();
    return {
      category: "Readme",
      action: "Link click",
      label: linkText
    };
  });

$(document).ready(function(){
  
  /* Recursos de desarrollo */
  if ( $( "#recursos-de-desarrollo" ).length ) {
    $.getJSON( "https://api.github.com/repos/e-gob/api-standards/readme?callback=?")
    .done(function( data ) {
      var c = new Markdown.Converter();
      var html = c.makeHtml(Base64.decode(data.data.content));
      var $html = $('<div>').append(html);

      var index = $('<div>').append($html.find('h2').first().remove()).html() + $('<div>').append($html.find('ul').first().remove()).html();

      //Add ID to 'h2' tag
      $html.find('h2').attr('id',function(i,e){
        return replaceStrangeChars( $(this).html().toLowerCase().split(' ').join('-') );
      });

      //Replace 'code' tag
      $html.find('code').html(function(){
        return $(this).html().replace(/javascript/g,'');
      });

      //Create tables
      $html.find('p').html(function(){
        var r = $(this).html();
        
        if($(this).html().charAt(0) == '|') {
            r = createTable($(this).html());
          }
        return r;
      });

      $('#recursos-de-desarrollo-content').html($html.html());
      $('#recursos-de-desarrollo-list').html(index);

    });
  }

});

function createTable(t){
  t = t.split("\n");

  var table = $('<table>');

  var tr, tds;
  $.each(t,function(i,e){
    e = e.replace(/\|/, '').replace(/\|$/, '');
    tr = (i==0)?['<tr class="title">']:['<tr>'];
    tds = e.split('|');
    $.each(tds,function(ix,td){
      tr.push('<td>'+td.trim()+'</td>');
    });
    tr.push('</tr>');
    table.append(tr.join(''));
  });

  return table;
}

function replaceStrangeChars(text) {
    var strange = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        regular = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";

    for (var i=0; i<strange.length; i++) {
        text = text.replace(strange.charAt(i), regular.charAt(i));
    }

    return text;
}
