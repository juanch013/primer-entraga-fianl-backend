const fs = require('fs');
const path = require("path")
const __dir = path.parse(__filename);

const getProd = (id) => {
    let productos = fs.readFileSync(__dir.dir+'\\..\\data\\productos.json')
    productos = JSON.parse(productos);

    let prod = productos.find(i=> i.id == id);

    if(prod == undefined){
        return -1
    }else{
        return prod;
    }

}

module.exports = getProd