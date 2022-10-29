const fs = require('fs');
const path = require("path")
const __dir = path.parse(__filename);

const ordenarProductos = require('../helpers/sortProducts');


const productsController = {
    listar:(req, res)=>{
        try {
            let productos = fs.readFileSync(__dir.dir+'\\..\\data\\productos.json')

            productos = JSON.parse(productos);

            return res.status(200).json({
                ok:true,
                msg:"Listado de productos",
                data:productos
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok:false,
                msg:"Server Error"
            })
        }
    },

    detalle:(req,res)=>{
        const{id} = req.params;

        try {
            let productos = fs.readFileSync(__dir.dir+'\\..\\data\\productos.json')
            productos = JSON.parse(productos);

            let prod = productos.find(i=> i.id == id);

            if(prod == undefined){
                return res.status(404).json({
                    ok:false,
                    msg:"Producto no encontrado"
                })
            }

            return res.status(200).json({
                ok:false,
                msg:"Detalle de producto",
                data:prod
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok:false,
                msg:"Server Error"
            })
        }
    },

    eliminar:(req,res)=>{
        const{id} = req.params;
        if(process.env.ADMIN == false){
            return res.status(401).json({
                ok:false,
                msg:"no tiene autorizacion"
            })
        }
        try {
            let productos = fs.readFileSync(__dir.dir+'\\..\\data\\productos.json')
            productos = JSON.parse(productos);

            let prod = productos.find(i=> i.id == id);

            if(prod == undefined){
                return res.status(404).json({
                    ok:false,
                    msg:"Producto no encontrado"
                })
            }

            let eliminado = productos.filter(i => i.id != id);

            fs.writeFileSync(__dir.dir+'\\..\\data\\productos.json',JSON.stringify(eliminado));

            return res.status(200).json({
                ok:false,
                msg:"Productos eliminado correctamente",
                data:prod
            })
            
        } catch (error) {
            return res.status(500).json({
                ok:false,
                msg:"Server Error"
            })
        }
    },

    modificar:(req,res)=>{
        const {nombre, descripcion, codigo,foto,precio,stock} = req.body;
        const {id} = req.params;
        if(process.env.ADMIN == false){
            return res.status(401).json({
                ok:false,
                msg:"no tiene autorizacion"
            })
        }
        try {
            let productos = fs.readFileSync(__dir.dir+'\\..\\data\\productos.json')
            productos = JSON.parse(productos);

            if(codigo != undefined){
                let c = productos.find(i => i.codigo == codigo);
                if(c != undefined){
                    console.log(c);
                    return res.status(400).json({
                        ok:false,
                        msg:"ya hay un producto registrado con ese codigo"
                    })
                }
            }
            let prodModificar = productos.find(p => p.id == id);

            if(prodModificar == undefined){
                return res.status(404).json({
                    ok:false,
                    msg:"Productos no existe"
                })
            }
            
            prodModificar = {
                id:prodModificar,
                nombre: nombre == undefined? prodModificar.nombre : nombre,
                precio: precio == undefined? prodModificar.precio : precio,
                descripcion: descripcion == undefined? prodModificar.descripcion : descripcion,
                stock: stock == undefined? prodModificar.stock : stock,
                foto: foto == undefined? prodModificar.foto : foto,
                codigo: codigo == undefined? prodModificar.codigo : codigo,
            }

            const nuevosProductos = productos.map((p)=>{
                if(p.id == id){
                    p.nombre = prodModificar.nombre,
                    p.descripcion = prodModificar.descripcion,
                    p.precio = prodModificar.precio,
                    p.stock = prodModificar.stock,
                    p.foto = prodModificar.foto,
                    p.codigo = prodModificar.codigo
                }
            })

            fs.writeFileSync(__dir.dir+'\\..\\data\\productos.json',JSON.stringify(nuevosProductos));

            return res.status(200).json({
                ok:false,
                msg:"Producto modificado correctamente",
                data:prodModificar
            })
            
        } catch (error) {
            return res.status(500).json({
                ok:false,
                msg:"Server Error"
            })
        }
    },

    crear:(req,res)=>{
        if(process.env.ADMIN == false){
            return res.status(401).json({
                ok:false,
                msg:"no tiene autorizacion"
            })
        }
        try {
            const {nombre, descripcion, codigo,foto,precio,stock} = req.body;

            if(!nombre || !codigo || !precio || !stock || typeof(precio) != 'number'){
                return res.status(400).json({
                    ok:false,
                    msg:"Bad request"
                })
            }

            let productos = fs.readFileSync(__dir.dir+'\\..\\data\\productos.json')
            productos = JSON.parse(productos);

            let c = productos.find(i => i.codigo == codigo);
            if(c != undefined){
                return res.status(400).json({
                    ok:false,
                    msg:"ya hay un producto registrado con ese codigo"
                })
            }
            

            let nuevoId = 0;
            if(productos.length == 0){
                nuevoId = 1
            }else{
                productos = ordenarProductos(productos);

                nuevoId = Number(productos[productos.length -1].id) + 1
            }

            let nuevoProd = {
                id:nuevoId,
                nombre:nombre,
                codigo:codigo,
                precio:precio,
                stock:stock,
                descripcion: descripcion == undefined? "" : descripcion,
                foto: foto == undefined? "" : foto,
                timestamp:new Date().toLocaleString()
            }

            productos.push(nuevoProd);

            fs.writeFileSync(__dir.dir+'\\..\\data\\productos.json',JSON.stringify(productos));

            return res.status(201).json({
                ok:true,
                msg:"Productos creado correctamente",
                data:nuevoProd
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok:false,
                msg:"Server Error"
            })
        }
    }
}


module.exports =  productsController