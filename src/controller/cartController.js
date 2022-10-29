const fs = require('fs');
const path = require("path");
const getProd = require('../helpers/getProd');
const ordenarProductos = require('../helpers/sortProducts');
const __dir = path.parse(__filename);

const cartController = {
    crear:(req,res)=>{

        try {
            let carritos = fs.readFileSync(__dir.dir+'\\..\\data\\carritos.json')
            carritos = JSON.parse(carritos);
            let nuevoId = 0

            if(carritos.length == 0){
                nuevoId = 1
            }else{
                carritos = ordenarProductos(carritos);
                nuevoId = Number(carritos[carritos.length - 1].id) + 1
            }

            let nuevoCarrito = {
             id:nuevoId,
             timestamp:new Date().toLocaleString(),
             producto:[],
            }
    
            carritos.push(nuevoCarrito);

            fs.writeFileSync(__dir.dir+'\\..\\data\\carritos.json',JSON.stringify(carritos));
            
            return res.status(201).json({
                ok:true,
                msg:"carrito creado correctamente",
                data:nuevoCarrito
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok:false,
                msg:"Server Error"
            })
        }


    },

    agregarProd:(req,res)=>{
        const {id_prod} = req.body;
        const{id} = req.params;
        try {
            let p = getProd(id_prod);
    
            if(p == -1){
                return res.status(404).json({
                    ok:false,
                    msg:"eeeerrroorrrr producto no encontrado"
                })
            }
    
            let carritos = fs.readFileSync(__dir.dir+'\\..\\data\\carritos.json')
            carritos = JSON.parse(carritos);
    
            for(c of carritos){
                if(c.id == id){
                    c.producto.push(p);
                }
            }
    
            fs.writeFileSync(__dir.dir+'\\..\\data\\carritos.json',JSON.stringify(carritos));
    
            return res.status(200).json({
                ok:true,
                msg:`Producto ${id_prod} agregado correctamente al carrito ${id}`,
                data:p
            })
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok:false,
                msg:"Server Error"
            })
        }
    },

    listar:(req,res)=>{
        const {id} = req.params;
        try {

            let carritos = fs.readFileSync(__dir.dir+'\\..\\data\\carritos.json')
            carritos = JSON.parse(carritos);
            
            let carrito = carritos.find(c => c.id == id);

            if(carrito == undefined){
                return res.status(404).json({
                    ok:false,
                    msg:"carrito no encontrado"
                })
            }

            return res.status(200).json({
                ok:true,
                msg:"listado de productos del carrito "+id,
                data:carrito.producto
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
        const {id} = req.params
        try {
            let carritos = fs.readFileSync(__dir.dir+'\\..\\data\\carritos.json')
            carritos = JSON.parse(carritos);

            let nuevosCarritos = carritos.filter(c => c.id != id)

            fs.writeFileSync(__dir.dir+'\\..\\data\\carritos.json',JSON.stringify(nuevosCarritos));
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok:false,
                msg:"Server Error"
            })
        }
    },

    eliminarProd:(req,res)=>{
        const {id, id_prod} = req.params
        try {
            let carritos = fs.readFileSync(__dir.dir+'\\..\\data\\carritos.json')
            carritos = JSON.parse(carritos);

            for(c of carritos){
                if(c.id == id){
                    c.producto = c.producto.filter(p=>p.id != id_prod)
                }
            }

            fs.writeFileSync(__dir.dir+'\\..\\data\\carritos.json',JSON.stringify(nuevosCarritos));

            return res.status(200).json({
                ok:false,
                msg:"producto eliminado correctamente"
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

module.exports = cartController