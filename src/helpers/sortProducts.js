const ordenarProductos = (prods)=>{
    prods.sort((a,b)=>{
        return a.id - b.id
    })

    return prods;
}

module.exports = ordenarProductos