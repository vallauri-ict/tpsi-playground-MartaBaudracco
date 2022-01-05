import * as _http from "http";
import HEADERS from "./headers.json"
import {Dispatcher} from "./dispatcher"
import * as mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B"

mongoClient.connect(CONNECTION_STRING, (err, client) => {
if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("vallauri");
    collection.aggregate([
        {"$project":{
            "mediaItaliano":{"$avg":"$italiano"},
            "mediaInformatica":{"$avg":"$informatica"},
            "mediaMatematica":{"$avg":"$matematica"},
            "mediaSistemi":{"$avg":"$sistemi"},
            "classe":1
            }
        },
        {"$project":{
            "mediaStudente":{"$avg":["$mediaItaliano","$mediaInformatica","$mediaMatematica","$mediaSistemi"]},
            "classe":1
        }},
        {"$group":{
            "_id":"$classe",
            "mediaClasse":{"$avg":"$mediaStudente"}
        }},
        {"$sort":{
            "mediaClasse":-1
        }},
        {"$project":{
            "mediaClasse":{"$round":["$mediaClasse",2]}
        }}
    ])
    .toArray((err, data) => {
    if (!err) {
        console.log("Query 2: ",data);
    } else {
        console.log("Errore esecuzione query");
    }
    client.close();
    });
} else{
    console.log("Errore connessione al db: " + err.message);
}
});  

mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("vallauri");
        collection.updateMany({"genere":"f", "classe":"4A"},{"$push":{"informatica":7 as never}},(function(err, data){
        if (!err) {
            console.log("Query 3: ",data);
        } else {
            console.log("Errore esecuzione query "+err);
        }
        client.close();
        }));
    } else{
        console.log("Errore connessione al db: " + err.message);
    }
});

mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("vallauri");
        collection.deleteMany({ "$and":[{"classe":"3B"}, {"sistemi":3}]}, (function(err, data){
        if (!err) {
            console.log("Query 4: ",data);
        } else {
            console.log("Errore esecuzione query "+err);
        }
        client.close();
        }));
    } else{
        console.log("Errore connessione al db: " + err.message);
    }
});  




mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (!err) {
        let db = client.db(DB_NAME);
        let collection = db.collection("vallauri");
        collection.aggregate([
            {"$group":{"_id":"$classe",
                       "sommaOreAssenze":{"$sum":"$assenze"}}
            },
            {"$sort":{"sommaOreAssenze":-1}}
        ])
        .toArray((err, data) => {
            if (!err) {
                console.log("Query 5: ",data);
            }
            else {
                console.log("Errore esecuzione query "+err);
            }
            client.close();
        })
    } else{
        console.log("Errore connessione al db: " + err.message);
    }
});  









