const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

// panggil model
const BlogPost = require("../models/blog");

exports.createBlogPost = (req, res, next) => {
  // cek request mengandung error atau tidak
  const errors = validationResult(req);

  // jika ada error akan bernilai false
  // jika tidak ada error akan bernilai true
  if (!errors.isEmpty()) {
    // diberi negasi pd if, maka jika mengandung error
    // res.status(400).json({
    //     message: "Request Error",
    //     data: null,
    // })

    // jadi akan berikan error massage baru
    // ini merupakan message yang akan dikirimkan
    const err = new Error("Input value tidak sesuai");
    // mengirimkan error status
    err.errorStatus = 400;
    // akan mengirimkan error data
    // value array akan dikirimkan
    err.data = errors.array();
    throw err;
  }

  // kalau request file tidak ada
  if (!req.file) {
    const err = new Error("Image harus di upload");
    err.errorStatus = 422;
    // error dikirimkan
    throw err;
  }

  const title = req.body.title;
  // image yang diterima hanya url saja yang disimpan di folder image
  const image = req.file.path;
  const body = req.body.body;

  // Posting akan dipanggil dari model BlogPost dari folder model
  // mengirimkan sebuah objek seperti title, body dan author
  const Posting = new BlogPost({
    title: title,
    body: body,
    image: image,
    author: { uid: 1, name: "leo" },
  });

  // variabel posting akan disimpan ke database
  // dicek success atau tidak
  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: "Create Blog Success",
        // data didapat dari request
        data: result,
      });
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.getAllBlogPost = (req, res, next) => {
  // 1 & 5 adalah default value
  // currentPage atau page sekarang
  const currentPage = req.query.page || 1;
  // perPage mau brp
  const perPage = req.query.perPage || 5;

  // mengetahui jumlah data yang dimiliki
  let totalItems;

  // untuk menghitung berapa jumlah data yang dimiliki
  // memanggil data dari database
  BlogPost.find()
  .countDocuments()
  // mendapatkan result berapa jumlah data
  // total data akan diisi di totalItems
  .then(count => {
    totalItems = count;
    return BlogPost.find()
    // memanggil beberapa data yang perlu dipanggil
    // skip artinya melewati beberapa data
    // contoh perhitungan = (1) - 1 = 0 * 5 = 0 artinya skip 0(data dipanggil semua)
    .skip((parseInt(currentPage) - 1) * parseInt(perPage))
    // data yang diberikan brp
    .limit(parseInt(perPage));
  })
  .then((result) => {
    res.status(200).json({
      message: "Data Blog Post berhasil Dipanggil",
      data: result,
      total_data: totalItems,
      per_page: parseInt(perPage),
      current_page: parseInt(currentPage),
    });
  })
  .catch(err => {
    // megirimkan error kedepan(ke index.js)
    next(err);
  });
};

exports.getAllBlogPostById = (req, res, next) => {
  // Mencari blogpost berdasarkan id yang diinginkan
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((result) => {
      // jika result tidak ditemukan atau false(dibuat negasi)
      if (!result) {
        const error = new Error("Blog Post tidak ditemukan");
        error.errorStatus = 404;
        throw error;
      }
      res.status(200).json({
        message: "Data Blog Post berhasil dipanggil",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateBlogPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Input value tidak sesuai");
    // mengirimkan error status
    err.errorStatus = 400;
    // akan mengirimkan error data
    // value array akan dikirimkan
    err.data = errors.array();
    throw err;
  }

  // kalau request file tidak ada
  if (!req.file) {
    const err = new Error("Image harus di upload");
    err.errorStatus = 422;
    // error dikirimkan
    throw err;
  }

  const title = req.body.title;
  // image yang diterima hanya url saja yang disimpan di folder image
  const image = req.file.path;
  const body = req.body.body;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog Post tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      }

      // mengganti post title, body dan image dengan yang baru
      post.title = title;
      post.body = body;
      post.image = image;

      // postingan yang lama disave, diupdate dengan yang baru.
      return post.save();
    })
    // multiple promise
    .then((result) => {
      res.status(200).json({
        message: "Update Success",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteBlogPost = (req, res, next) => {
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      // jika result tidak ditemukan atau false(dibuat negasi)
      if (!post) {
        const error = new Error("Blog Post tidak ditemukan");
        error.errorStatus = 404;
        throw error;
      }

      // remove image
      removeImage(post.image);
      // meremove postingan berdasarkan Id
      return BlogPost.findByIdAndRemove(postId);
    })
    .then((result) => {
      // memunculkan response status
      res.status(200).json({
        message: "Hapus Data Blog Post berhasil",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const removeImage = (filePath) => {
  console.log("filePath: ", filePath);
  console.log("dirname: ", __dirname);

  // menggabungkan 2 path yaitu dirname dan filePath
  filePath = path.join(__dirname, "../..", filePath);
  // meremove image yang dimiliki
  fs.unlink(filePath, (err) => console.log(err));
};
