const express = require("express");
const router = express.Router();
const cartController = require('../controller/cartController');

router.post('/',cartController.crear);

router.get('/:id/productos',cartController.listar);
router.post('/:id/productos',cartController.agregarProd);
router.delete('/:id',cartController.eliminar);
router.delete('/:id/productos/:id_prod',cartController.eliminar);

module.exports = router