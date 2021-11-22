import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
import * as _querystring from "query-string";


import { callbackify, inherits } from "util";
let HEADERS = require("./headers.json");
let paginaErrore : string;

class Dispatcher{
    prompt : string = ">>>";
    //ogni listener è costituito da un json del tipo {"risorsa":"callback"}
    //I listener sono suddivisi in base al metodo di chiamata
    listeners : any = {
        "GET" : {},
        "POST" : {},
        "DELETE" : {},
        "PUT" : {},
        "PATCH" : {}
    }

    constructor(){
        init();
    }

    addListener(metodo:string, risorsa:string, callback:any){
        metodo = metodo.toUpperCase();
       /* if(this.listeners[metodo]){} uguale a quello sotto */
        if (metodo in this.listeners){//se il metodo esiste
            this.listeners[metodo][risorsa] = callback;
        }
        else{
            throw new Error("Metodo non valido");
        }
    }

    dispatch(req,res){
        let metodo = req.method.toUpperCase();
        if(metodo == "GET"){
            innerDispatch(req,res);
        }
        else{
            let parametriBody : string = "";
            req.on("data",function(data){
                parametriBody += data;
            });
            let parametriJson = {};
            req.on("end",function(){
                try{
                    //se i parametri sono in JSON i quasta conversione va a buon fine
                    //altrimenti sono url encoded e passiamo nel catch
                    parametriJson = JSON.parse(parametriBody);
                }catch(error){
                    parametriBody = _querystring.parse(parametriBody);
                }
            });
        }
    }

    
}

function innerDispatch(req,res){
    // Lettura di metodo, risorsa e parametri
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;

    req["GET"] = parametri;

    console.log(`>>> ${this.prompt}${metodo} : ${risorsa} {${JSON.stringify(parametri)}}`);//alt 96 per gli apici
    
    if(risorsa.startsWith("/api/")){
        if(risorsa in this.listeners[metodo]){
            let _callback = this.listeners[metodo][risorsa];
            //lancio in esecuzione la callback interna a listeners
            _callback(req,res);
        }
        else{
            //il client si aspetta un json
            //in caso di errore posso mandare una stringa al posto del json
            res.writeHead(404, HEADERS.text);
            res.write("Servizio non trovato");
            res.end();
        }
    }
    else{
        staticListener(req,res,risorsa);
    }
}

function staticListener(req,res,risorsa){
    if(risorsa == "/"){
        risorsa = "/index.html";
    }
    //risorsa inizia sempre per "/"
    let fileName = "./static"+risorsa;
    _fs.readFile(fileName,function(err,data){
        if(!err){
            let header = {"Content-Type" : _mime.getType(fileName)};
            res.writeHead(200,header);
            res.write(data);
            res.end();
        }
        else{
            console.log(`   ${err.code} : ${err.message}`);
            //il client si aspetta una pagina
            res.writeHead(404,HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    });
}

function init(){
    _fs.readFile("./static/error.html",function(err,data){
        if(!err){
            paginaErrore = data.toString();
        }
        else{
            paginaErrore = "<h1>Pagina non trovata</h1>";
        }
    });
}

module.exports = new Dispatcher();//export anonimo della classe