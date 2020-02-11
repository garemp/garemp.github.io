$('h1').remove();

$().ready(function () {
    $("#ph-issue").load("./issue.html");
    $("<a href='https://github.com/garemp/garemp.github.io/issues/new'><input type=button value='Report Issues' /></a>").insertBefore("#ph-issue");
    $("#ph-copy").load("./copyright.html");
    $("#ph-hist").load("./history.html");
    $("#ph-src").load("./source.html");
    $.getJSON("./maps.json", function (data) {
        $("#text").html("JSON file version: " + data["version"]);
        nodes = data["nodes"];
        $.each(nodes, function (idx, n) {
            var type = "";
            var prop = "";
            var commet = "";
            for (i = 0; i < Object.values(n.attributes).length; i++) {
                if (n.attributes[i] == "cylindrical" || n.attributes[i] == "conic" ||
                    n.attributes[i] == "azimuthal" || n.attributes[i] == "pseudocylindrical" ||
                    n.attributes[i] == "pseudoconic" || n.attributes[i] == "polyhedral" ||
                    n.attributes[i] == "miscellaneous")
                    type = n.attributes[i];
                if (n.attributes[i] == "equal-area" || n.attributes[i] == "conformal" ||
                    n.attributes[i] == "equidistant" || n.attributes[i] == "compromise")
                    if (prop == "")
                        prop = n.attributes[i];
                    else
                        prop = prop + ", " + n.attributes[i];
            }
            if (typeof n.alias === "undefined")
                $("#list-body").append("<tr><td>" + (idx + 1) + "</td><td>" + n.label + "</td><td>" + type + "</td><td>" + prop + "</td><td>" + n.crby + "</td><td>" + n.year + "</td><td>" + commet + "</td></tr>");
            else
                $("#list-body").append("<tr><td>" + (idx + 1) + "</td><td>" + n.label + " (" + n.alias + ")</td><td>" + type + "</td><td>" + prop + "</td><td>" + n.crby + "</td><td>" + n.year + "</td><td>" + commet + "</td></tr>");
        })
        $("thead").prev().remove();
        $('#list-table').DataTable();
        $('select').empty().append("<option value='10'>10</option>").append("<option value='20'>20</option>")
            .append("<option value='30'>30</option>").append("<option value='60'>60</option>").append("<option value='120'>120</option>");
        $(".markdown-body").toggleClass('markdown-body').toggleClass('px-3').toggleClass('my-5').toggleClass('container-lg');
        $(".footer").remove();
        $(document).attr("title", "GAREMP: Graphical Attribute and Relationship Explorer for Map Projections");
    });
});
