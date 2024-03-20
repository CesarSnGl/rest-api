import {  Router } from "express";
const router = Router();

import { authJwt } from '../middlewares/';


import * as productsCtrl from "../controllers/products.controller.js";
//Verificar token
import { verifyToken } from "../middlewares/index.js";

//Establecer ruta products mediante el metodo GET
//rutas para el controlador
//se coloca "verifyToken" para validar el token en las rutas
router.get("/", productsCtrl.getProducts);
router.post('/', [authJwt.verifyToken,authJwt.isAdmin ], productsCtrl.createProduct);
router.get("/:productId", productsCtrl.getProductById);
router.put("/:productId", [authJwt.verifyToken, authJwt.isAdmin || authJwt.isModerator], productsCtrl.updateProductById);
router.delete("/:productId", [authJwt.verifyToken, authJwt.isAdmin || authJwt.isModerator], productsCtrl.deleteProductById);

export default router;