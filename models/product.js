const mongoose = require("mongoose");
const { idGenerator } = require("../utils");
const Float = require("mongoose-float").loadType(mongoose, 2);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name of product"],
      maxLength: 100,
    },
    image: {
      type: Object,
      required: [false, "Please provide product image"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    price: {
      type: Float,
      default: 0.0,
      required: [true, "Please provide product price"],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
    user: {
      ref: "user",
      type: Number,
      required: true,
    },
  },
  { timestamp: true }
);

// idGenerator("product", productSchema);

productSchema.pre("remove", async function () {
  await this.model("productReview").deleteMany({ product: this._id });
});

const product = mongoose.model("product", productSchema);

module.exports = product;
