"use strict"

const _http = require("http");
const _url = require("url");
const _fs = require("fs");
const HEADERS = require("./headers.json");
const _mime = require("mime");

const PORT = 1337;
let paginaErrore;

var server = _http.createServer(function (req, res) {
    // Lettura di metodo, risorsa e parametri
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;
    console.log(`Richiesta: ${metodo}-${risorsa}, param: ${JSON.stringify(parametri)}`);

    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    if (!risorsa.startsWith("/api/")) {   // "/api/" è un servizio, per distinguere servizi dalle pagine
        risorsa = "./static" + risorsa;
        _fs.readFile(risorsa, function (error, data) {
            if (!error) {
                let header = { "Content-Type": _mime.getType(risorsa) }
                res.writeHead(200, header);
                res.write(data);
                res.end();
            }
            else{
                res.writeHead(404, HEADERS.html);
                res.write(paginaErrore);
                res.end();
            }
        });
    }
    else if(risorsa == "/api/servizio1"){
        //gestione servizi, utilizzo else if per ogni rischiesta diservizio, 
        //più una else finale quando richiedo un servizio che non esiste

        //gestione servizio1
        let json = {"ris":"ok"};
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify(json));
        res.end();

    }
    else{
        res.writeHead(404, HEADERS.text);
        res.write("Servizio richiesto inesistente");
        res.end();
    }

});

server.listen(PORT, function(){
    _fs.readFile("./static/error.html", function(errore, daat){
        if(!errore){
            paginaErrore = data;
        }
        else{
            paginaErrore = "<h1>Pagina non trovata</h1>";
        }
    })
});
console.log("Server in esecuzione! Porta: " + PORT);
