import * as _http from "http";
import HEADERS from "./headers.json";
import {Dispatcher} from "./dispatcher";
import states from "./states.json";
import radios from "./radios.json";

import { read } from "fs";
let port : number = 1337;

let dispatcher :Dispatcher = new Dispatcher();

let server = _http.createServer(function(req, res){
    dispatcher.dispatch(req, res);
})
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

//Registrazione del servizio 
dispatcher.addListener("GET", "/api/elenco", function(req, res){
    res.writeHead(200,HEADERS.json); 
    res.write(JSON.stringify(states));
    res.end();
});

dispatcher.addListener("POST", "/api/radio", function(req, res){
    let reqRegione = req["BODY"].regione;
    let reqRadio ={};
    if(reqRegione=="tutti"){
        reqRadio = radios;
    }
    else{
        reqRadio = radios.filter((radio) => radio.state == reqRegione);
    }
    res.writeHead(200,HEADERS.json); 
    res.write(JSON.stringify(reqRadio));
    res.end();
});
