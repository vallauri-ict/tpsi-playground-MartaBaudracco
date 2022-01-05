const _http = require("http");
const _url = require("url");
const _colors = require("colors");
const HEADERS = require("./headers.json");


const port = 1337;

// creo il server e mi facio reatituire il puntatore
let server=_http.createServer(function (req, res) {
    
    /* PROVA BASE
    // non ho avuto errori mando una risposta
    res.writeHead(200, HEADERS.text);
    // risposta da inviare
    res.write("Richiesta eseguita correttamente");
    // invio la risposta
	res.end();	

    console.log("Richiesta eseguita");
    */

    // lettura di metodo risorsa e parametri
    let metodo = req.method;
    // parsing della url ricevuta, true per parsificare anche i parametri
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;

    let dominio = req.headers.host;

    res.writeHead(200, HEADERS.html);
    res.write("<h1> Informazioni relative alla richiesta ricevuta</h1>");
    res.write("<br>");
    res.write(`<p><b> Risorsa richiesta : </b>${risorsa} </p>`); // alt 96
    res.write(`<p><b> Metodo : </b></${metodo}p>`);
    parametri = JSON.stringify(parametri);
    res.write(`<p><b> Parametri : </b>${parametri}</p>`);
    es.write(`<p><b> Dominio richiesto : </b>${dominio}</p>`);
    res.end();

    console.log("Richiesta ricevuta "+req.url);

});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
// avvio il server
server.listen(port);
console.log("server in ascolto sulla porta " + port);