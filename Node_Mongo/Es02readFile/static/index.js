$(document).ready(function() {
    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizo1", {"nome":"pippo"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
});

$(document).ready(function() {
    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizo2", {"nome":"pippo"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
});

