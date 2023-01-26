





const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const {
  uploadProductImage,
  removeProductImage,
} = require("../services/imageUploader");
const { response } = require("../services/response");
const {
  findById,
  findAll,
  findByIdAndUpdate,
  findByIdAndDelete,
} = require("../services/model.services");

//@route         POST  - /api/v1/product
//@Description   Create a single product
//@permission    Private

const createProduct = async (req, res) => {
  const imageSize = req.file.size;
  const maxSize = 1024 * 1024; //1Mb
  if (imageSize > maxSize) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      "Image size is too large, please upload image less than 1Mb"
    );
  }
  const { name, category, description, price } = req.body;
  if (name && category && description && price) {
    const uploadedImage = await uploadProductImage(req.file.path);
    req.body.user = req.user.id;
    req.body.image = uploadedImage;
    console.log(req.body);
    const product = await Product.create(req.body);
    return response(
      res,
      StatusCodes.CREATED,
      "Product created successfully",
      product
    );
  } else {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      "All parameters are required",
      null
    );
  }
};

//@route         GET  - /api/v1/product/:id
//@Description   Get a single product
//@permission    Public

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  findById(res, Product, id);
};

//@route         GET  - /api/v1/product
//@Description   Get all product
//@permission    Public

const getAllProduct = async (req, res) => {
  findAll(res, Product);
};

//@route         PUT  - /api/v1/product/:id
//@Description   Update a single product
//@permission    Private

const updateProduct = async (req, res) => {
  const { id } = req.params;
  findByIdAndUpdate(req, res, Product, id);

  if (req.file) {
    const data = await Product.findOne({ _id: id });
    removeProductImage(data.image.public_id); //if user is updating product image, delete previous product image from cloudinary
  }
};

//@route         DELETE  - /api/v1/product/:id
//@Description   Delete a single product
//@permission    Private

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  findByIdAndDelete(res, Product, id);
};

const productControllers = {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};

module.exports = productControllers;

