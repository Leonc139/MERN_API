// console.log('hello');

// import node js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
// deklarasi router
const productRoutes = require("./src/routes/products");
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

// setup untuk menyimpan file yang diupload
const fileStorage = multer.diskStorage({
  // destination atau dimana lokasi
  destination: (req, file, cb) => {
    // callback
    // error tidak ada atau null, kl success akan dikirimkan 'images'
    // 'images' ini merupakan folder dimana akan disimpan
    cb(null, "images");
  },
  // format penamaan file yang akan ditentukan di folder image
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

// membuat logic untuk memfilter hanya menerima file image
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // body yang diterima/diambil type JSON

// middleware
// jika terjadi pemanggilan untuk url 'images' maka akan melakukan tindakan middleware
// express.static(url static) artinya akan membuat folder static yang bisa diakses dari luar
// join(gabungkan) antara direktori name(lokasi dimana project kita berada) dengan folder "image"
app.use("/images", express.static(path.join(__dirname, "images")));
// "single" pengiriman tipe single dan body harus bernama "image"
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use((req, res, next) => {
  // kalau request yang dikirim oleh client
  // "Access-Control-Allow-Origin" artinya akan mengizinkan origin(url yang akan mengakses API)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  // content-type dikirimkan dengan json, Authorization: akan digunakan ketika pengiriman token kedalam API
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// jika menemukan "/" maka akan lari ke productRoutes
// app.use("/v1/customer", productRoutes);

// masuk ke routes auth
app.use("/v1/auth", authRoutes);
// masuk ke routes blog
app.use("/v1/blog", blogRoutes);

app.use((error, req, res, next) => {
  // akan mengirimkan error status, jika tidak mengirimkan error status
  // maka akan mengirimkan default yaitu 500
  const status = error.errorStatus || 500;
  // menentukan message dari message yang dikirimkan
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});

// endpoint method
// GET '/users' ==> [{name: leo}]

// mengkoneksikan node js ke mongoDB
mongoose
  .connect(
    "mongodb+srv://<username>:<password>@cluster0.jmrbkd1.mongodb.net/<dbname>?retryWrites=true&w=majority"
  )
  // jika then berhasil, maka akan menjalankan server
  .then(() => {
    app.listen(4000, () => console.log("Connection Success"));
  })
  .catch((err) => console.log(err));
