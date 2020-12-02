import {extractColumnBasedValues} from "./utils";

function FIND_2020_WITH_2(cells) {
    const [ values ] = extractColumnBasedValues(cells);
    for(var i=0; i<values.length; i++){
        for(var j=i+1; j<values.length; j++){
            if(values[i] + values[j] === 2020) {
                return [values[i], values[j]];
            }
        }
    }

    return ["not found"];
}

function FIND_2020_WITH_3(cells) {
    const [ values ] = extractColumnBasedValues(cells);
    for(var i=0; i<values.length; i++){
        for(var j=i+1; j<values.length; j++){
            for(var k=j+1; k<values.length; k++){
                if(values[i] + values[j] + values[k] === 2020) {
                    return [values[i], values[j], values[k]];
                }
            }
        }
    }

    return ["not found"];
}
