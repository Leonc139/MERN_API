exports.createProduct = (req, res, next) => {
  // data name didapatkan dari request body name
  const name = req.body.name;
  // data price didapatkan dari request body price
  const price = req.body.price;
  res.json({
    message: "Create Product Success",
    data: {
      id: 1,
      name: name,
      price: price,
    },
  });
  next();
};

exports.getAllProducts = (req, res, next) => {
  //   console.log("url:", req.originalUrl);
  //   console.log("method:", req.method);
  // mengirimkan respon ke client
  res.json({
    message: "Get All Product Success",
    data: [
      {
        id: 1,
        name: "Roti Bakar",
        price: 20000,
      },
    ],
  });
  // supaya server lanjut berjalan tidak berhenti disini
  // ketika memiliki method lainnya
  next();
};
