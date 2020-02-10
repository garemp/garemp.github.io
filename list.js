$('h1').remove();

$().ready(function () {
    $.getJSON("./maps.json", function (data) {
        $("#text").html("JSON file version: " + data["version"]);
        nodes = data["nodes"];
        $.each(nodes, function (idx, n) {
            var type = "";
            var prop = "";
            var commet = "";
            for (i = 0; i < Object.values(n.attributes).length; i++) {
                if (n.attributes[i] == "cylindrical")
                    type = "cylindrical";
                if (n.attributes[i] == "conic")
                    type = "conic";
                if (n.attributes[i] == "azimuthal")
                    type = "azimuthal";
                if (n.attributes[i] == "equal-area")
                    if (prop == "")
                        prop = "equal-area";
                    else
                        prop = prop + ", equal-area";
                if (n.attributes[i] == "conformal")
                    prop = "conformal";
                if (n.attributes[i] == "equidistant")
                    if (prop == "")
                        prop = "equidistant";
                    else
                        prop = prop + ", equidistant";
                if (n.attributes[i] == "compromise")
                    prop = "compromise";
            }
            $("#list-body").append("<tr><td>" + (idx + 1) + "</td><td>" + n.label + "</td><td>" + type + "</td><td>" + prop + "</td><td>" + n.crby + "</td><td>" + n.year + "</td><td>" + commet + "</td></tr>");
        })
        $("thead").prev().remove();
        $('#list-table').DataTable();
    });
});
