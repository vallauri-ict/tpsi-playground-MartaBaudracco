import * as _http from "http";
let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");
let port : number = 1337;

let server = _http.createServer(function(req,res){
    //facciamo partire il dispatcher
    dispatcher.dispatch(req,res);

});
server.listen(port);//se non metto port ascolta su tutte le porte della macchina
console.log("Server in ascolto sulla porta" + port);

//Registrazione dei servizi
dispatcher.addListener("POST","/api/Servizio1",function(req,res){
    res.writeHead(200,HEADERS.json);
    let nome = req["GET"].nome;
    res.write(JSON.stringify({"ris":nome}));
    res.end();
});