$(document).ready(function() {
let _list = $("#lstRegioni");
    let requestElenco = inviaRichiesta("GET", "/api/elenco");
    requestElenco.fail(errore);
    requestElenco.done(function(states){
        for (const state of states) {
            let regione = state.name;
            let option = $("<option>");
            option.prop("value",state.name);
            option.prop("regione",state.name);
            option.prop("text",state.name +" [ "+ state.stationcount+" emittente]");
            option.appendTo(_list);
        }
        _list.on("change",function(){
            let regione = _list.val().split("[")[0];
            let requestWebRadio = inviaRichiesta("POST", "/api/radio", {"regione":regione});
            requestWebRadio.fail(errore);
            requestWebRadio.done(function(data){
                console.log(data);
            })
        });
    });
});
