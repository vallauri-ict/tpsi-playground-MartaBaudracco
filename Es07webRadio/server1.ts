import * as _fs from "fs";
import HEADERS from "./headers.json"
import {Dispatcher} from "./dispatcher"

//lettura file radios.json (import)
import radios from "./radios.json"

//lettura file readFile states.json (readFile)
_fs.readFile("./states.json", function(err, data){
    if(err){
        console.error(err);
        return;
    }
    else{
        //data è il contenuto del fil espresso in forma binaria
        // se il file è un file di testo è NECESSARIO eseguire
        // un toString() finale
        //console.log(data.toString());
        elabora(JSON.parse(data.toString()));
    }
})

function elabora(states){
    for (const state of states) {
        for(const radio of radios){
            if(radio.state == state.value){
                state.stationcount = parseInt(state.stationcount)+1;
                state.stationcount = (state.stationcount).toString();
            }
        }
    }
    _fs.writeFile("./states.json",JSON.stringify(states),function(err){
        if(err){
            console.log(err.message);
            return;
        }
        else{
            //bisogna lanciare con il comando seguente 
            // per ignorare le modifiche di states.json
            //nodemon --ignore 'states.js'
            console.log("file salvato correttamente");
        }
    })
}



