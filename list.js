$('h1').remove();

$().ready(function(){
    $.getJSON( "./maps.json", function( data ) {
    $("#text").html("JSON file version: " + data["version"]);
    nodes = data["nodes"];
    $.each(nodes, function(key,value) {
        $("<tr></tr>").insertAfter("#text");
    })
  });
});
