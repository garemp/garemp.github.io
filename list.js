$('h1').remove();

$().ready(function(){
    $.getJSON( "./maps.json", function( data ) {
    $("#text").html(data["version"]);
  });
});
