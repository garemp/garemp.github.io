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
                    n.attributes[i] == "pseudoconic" || n.attributes[i] == "pseudoazimuthal" ||
                    n.attributes[i] == "polyconic" || n.attributes[i] == "polyhedral" ||
                    n.attributes[i] == "miscellaneous" || n.attributes[i] == "lenticular")
                    if (type == "") type = n.attributes[i];
                    else type = type + ", " + n.attributes[i];
                if (n.attributes[i] == "equal-area" || n.attributes[i] == "conformal" ||
                    n.attributes[i] == "equidistant" || n.attributes[i] == "compromise")
                    if (prop == "") prop = n.attributes[i];
                    else prop = prop + ", " + n.attributes[i];
                var cc = "";
                if (n.attributes[i] == "2:1 ellipse") cc = "2:1 ellipse (=)";
                if (cc != "")
                    if (commet == "") commet = cc;
                    else commet = commet + ", " + cc;
                var cc = "";
                if (n.attributes[i] == "(may be) interrupted") cc = "\\/\\\\/\\\\/\\";
                if (cc != "")
                    if (commet == "") commet = cc;
                    else commet = commet + ", " + cc;
                var cc = "";
                if (n.attributes[i] == "evenly spaced") cc = "####";
                if (cc != "")
                    if (commet == "") commet = cc;
                    else commet = commet + ", " + cc;
                var cc = "";
                if (n.attributes[i] == "as straight lines") cc = "<__>";
                if (cc != "")
                    if (commet == "") commet = cc;
                    else commet = commet + ", " + cc;
                var cc = "";
                if (n.attributes[i] == "as points") cc = "<.>";
                if (cc != "")
                    if (commet == "") commet = cc;
                    else commet = commet + ", " + cc;
                var cc = "";
                if (n.attributes[i] == "cylindrical equal-area family") cc = "CEA";
                if (cc != "")
                    if (commet == "") commet = cc;
                    else commet = commet + ", " + cc;
                var cc = "";
                if (n.attributes[i] == "Tobler hyperelliptical family") cc = "TBH";
                if (cc != "")
                    if (commet == "") commet = cc;
                    else commet = commet + ", " + cc;
                med = ["elliptical", "sinusoidal", "quartic", "parabolic", "hyperbolic"];
                Object.values(med).forEach(function (c, idx) {
                    var cc = "";
                    if (n.attributes[i] == c) cc = c + " meridians";
                    if (cc != "")
                        if (commet == "") commet = cc;
                        else commet = commet + ", " + cc;
                })
            }
            var cc = "";
            if (n.label == "Eckert 1") cc = "Eckert 2 (=)"
            if (n.label == "Eckert 2") cc = "Eckert 1 (=)"
            if (n.label == "Eckert 3") cc = "Eckert 4 (=), Ortelius Oval (=)"
            if (n.label == "Eckert 4") cc = "Eckert 3 (=), Ortelius Oval (=)"
            if (n.label == "Ortelius Oval") cc = "Eckert 3 (=), Eckert 4 (=)"
            if (n.label == "Eckert 5") cc = "Eckert 6 (=)"
            if (n.label == "Eckert 6") cc = "Eckert 5 (=)"
            if (n.label == "Putniņš P1") cc = "Putniņš P2 (=), Boggs eumorphic (~), Siemon IV (~)"
            if (n.label == "Putniņš P2") cc = "Putniņš P1 (=), Boggs eumorphic (~), Siemon IV (~)"
            if (n.label == "Putniņš P3") cc = "Craster's parabolic (=)"
            if (n.label == "Craster's parabolic") cc = "Putniņš P3 (=)"
            if (n.label == "Putniņš P5") cc = "Putniņš P6 (=)"
            if (n.label == "Putniņš P6") cc = "Putniņš P5 (=)"
            if (n.label == "Putniņš P3\u0027") cc = "Putniņš P4\u0027 (=), Wagner 1 (~), Wagner 2 (~), Wagner 3 (~), Putniņš P3 + Plate Carrée"
            if (n.label == "Putniņš P4\u0027") cc = "Putniņš P3\u0027 (=), Wagner 1 (~), Wagner 2 (~), Wagner 3 (~)"
            if (n.label == "Putniņš P5\u0027") cc = "Putniņš P6\u0027 (=)"
            if (n.label == "Putniņš P6\u0027") cc = "Putniņš P5\u0027 (=)"
            if (n.label == "Wagner 1") cc = "Wagner 2 (=), Wagner 3 (=), Putniņš P3\u0027 (~), Putniņš P4\u0027 (~)"
            if (n.label == "Wagner 2") cc = "Wagner 1 (=), Wagner 3 (=), Putniņš P3\u0027 (~), Putniņš P4\u0027 (~)"
            if (n.label == "Wagner 3") cc = "Wagner 1 (=), Wagner 2 (=), Putniņš P3\u0027 (~), Putniņš P4\u0027 (~)"
            if (n.label == "Wagner 4") cc = "Wagner 5 (=), Wagner 6 (=)"
            if (n.label == "Wagner 5") cc = "Wagner 4 (=), Wagner 6 (=)"
            if (n.label == "Wagner 6") cc = "Wagner 4 (=), Wagner 5 (=), Putniņš P1 + Plate Carrée"
            if (n.label == "Wagner 7") cc = "Wagner 8 (=)"
            if (n.label == "Wagner 8") cc = "Wagner 7 (=)"
            if (n.label == "Apian Globular I") cc = "Bacon Globular (=)"
            if (n.label == "Bacon Globular") cc = "Apian Globular I (=)"
            if (n.label == "Boggs eumorphic") cc = "Putniņš P1 (~), Putniņš P2 (~), Siemon IV (~), Sinusoidal + Mollweide";
            if (n.label == "Siemon IV") cc = "Putniņš P1 (~), Putniņš P2 (~), Boggs eumorphic (~)";
            if (n.label == "Wagner 6") cc = "Kavrayskiy 7 (stretch)";
            if (n.label == "Kavrayskiy 7") cc = "Wagner 6 (stretch)";
            if (n.label == "Werner") cc = "Bonne group";
            if (n.label == "Bottomley") cc = "Bonne group";
            if (n.label == "Sinusoidal") cc = "Bonne group";
            if (n.label == "Dedistort") cc = "A4 + Ciric I";
            if (n.label == "Arden-Close") cc = "Mercator + Lambert cylindrical";
            if (n.label == "Winkel 1") cc = "Sinusoidal + Equirectangular";
            if (n.label == "Winkel 2") cc = "Apian II + Equirectangular";
            if (n.label == "Winkel 3") cc = "Aitoff + Equirectangular";
            if (n.label == "Winkel-Snyder") cc = "Mollweide + Equirectangular";
            if (n.label == "Mayr") cc = "Sinusoidal + Lambert cylindrical";
            if (n.label == "Foucaut Sinusoidal") cc = "Sinusoidal + Lambert cylindrical";
            if (n.label == "Kavrayskiy 1") cc = "Mercator + Equirectangular";
            if (n.label == "HEALPix") cc = "Collignon + Lambert cylindrical";
            if (n.label == "Goode homolosire") cc = "Sinusoidal + Mollweide";
            if (n.label == "McBryde S2") cc = "Sinusoidal + Eckert 6";
            if (n.label == "McBryde S3") cc = "Sinusoidal + McBT FPS";
            if (n.label == "McBryde P3") cc = "Craster's parabolic + McBT FPP";
            if (n.label == "McBryde Q3") cc = "Quartic authalic + McBT FPQ";
            if (n.label == "Trans. Cylindrical") cc = "transverse of Lambert cylindrical";
            if (n.label == "UTM/Gauss–Krüger") cc = "transverse of Mercator";
            if (n.label == "Cassini") cc = "transverse of Plate Carrée";
            if (n.label == "Briesemeister") cc = "oblique of Hammer";
            if (n.label == "Atlantis") cc = "oblique of Mollweide";
            if (n.label == "Hammer") cc = "<= Lambert azimuthal equal-area";
            if (n.label == "Aitoff") cc = "<= Azimuthal equidistant";
            if (n.label == "") cc = "";
            if (n.label == "") cc = "";
            if (n.label == "") cc = "";
            if (cc != "")
                if (commet == "") commet = cc;
                else commet = commet + ", " + cc;
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
