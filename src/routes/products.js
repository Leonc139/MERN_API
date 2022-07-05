const express = require("express");
// membuat router
const router = express.Router();

// memanggil file products semua function didalamnya
const productsController = require("../controllers/products");

// CREATE --> post : localhost:4000/v1/customer/product
router.post("/product", productsController.createProduct);

// READ --> get : localhost:4000/v1/customer/products
router.get("/products", productsController.getAllProducts);

module.exports = router;
