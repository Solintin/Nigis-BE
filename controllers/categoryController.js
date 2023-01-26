const Category = require("../models/category");
const { StatusCodes } = require("http-status-codes");

const { response } = require("../services/response");
const {
  findById,
  findAll,
  findByIdAndUpdate,
  findByIdAndDelete,
} = require("../services/model.services");

//@route         POST  - /api/v1/Category
//@Description   Create a single Category
//@permission    Private

const createCategory = async (req, res) => {

  const { name, description } = req.body;
  if (name && description ) {
    req.body.user = req.user.id;
    const category = await Category.create(req.body);
    return response(
      res,
      StatusCodes.CREATED,
      "Category created successfully",
      category
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

//@route         GET  - /api/v1/Category/:id
//@Description   Get a single Category
//@permission    Public

const getSingleCategory = async (req, res) => {
  const { id } = req.params;
  findById(res, Category, id);
};

//@route         GET  - /api/v1/Category
//@Description   Get all Category
//@permission    Public

const getAllCategory = async (req, res) => {
  findAll(res, Category);
};

//@route         PUT  - /api/v1/Category/:id
//@Description   Update a single Category
//@permission    Private

const updateCategory = async (req, res) => {
  const { id } = req.params;
  findByIdAndUpdate(req, res, Category, id);

};

//@route         DELETE  - /api/v1/Category/:id
//@Description   Delete a single Category
//@permission    Private

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  findByIdAndDelete(res, Category, id);
};

const CategoryControllers = {
  createCategory,
  getSingleCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};

module.exports = CategoryControllers;




