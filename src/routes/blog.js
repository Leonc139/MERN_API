const express = require("express");
const { body } = require("express-validator");

// membuat router
const router = express.Router();

const blogController = require("../controllers/blog");

// [POST] : /v1/blog/post
// membuat array berisi validasi
// cek request body title dan body
// beri validasi "title" harus memiliki karakter minimum 5 huruf
// cek juga untuk "body" harus memiliki karakter minimum 5 huruf
router.post(
  "/post",
  // Menambahkan validasi didalam request
  [
    body("title").isLength({ min: 5 }).withMessage("input title tidak sesuai"),
    body("body").isLength({ min: 5 }).withMessage("input body tidak sesuai"),
  ],
  blogController.createBlogPost
);

router.get("/posts", blogController.getAllBlogPost);
// Memanggil blog post dengan id tertentu
router.get("/post/:postId", blogController.getAllBlogPostById);
// mengupdate blog post
router.put(
  "/post/:postId",
  [
    body("title").isLength({ min: 5 }).withMessage("input title tidak sesuai"),
    body("body").isLength({ min: 5 }).withMessage("input body tidak sesuai"),
  ],
  blogController.updateBlogPost
);
// Delete Blog POst
router.delete('/post/:postId', blogController.deleteBlogPost);

module.exports = router;
