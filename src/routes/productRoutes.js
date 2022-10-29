const express = require("express");
const router = express.Router();
const productsController = require('../controller/productsController');


router.get("/",productsController.listar);

router.get("/:id",productsController.detalle);

router.delete("/:id",productsController.eliminar);

router.post("/",productsController.crear);

router.put("/:id",productsController.modificar);

module.exports = router
