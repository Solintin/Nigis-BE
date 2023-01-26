const mongoose = require("mongoose");
const { idGenerator } = require("../utils");

const productReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please provide comment"],
    },
    product: {
      ref: "product",
      type: Number,
      required: true,
    },
    user: {
      ref: "user",
      type: Number,
      required: true,
    },
  },
  { timestamp: true }
);

// idGenerator("product_review", productReviewSchema);

productReviewSchema.statics.calcalations = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: null,
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);
  try {
    await this.model("product").findByIdAndUpdate(productId, {
      reviewCount: Math.ceil(result[0]?.reviewCount),
    });
  } catch (error) {
    console.log(error);
  }
};
productReviewSchema.post("save", async function () {
  await this.constructor.calcalations(this.product);
});
productReviewSchema.post("remove", async function () {
  await this.constructor.calcalations(this.product);
});

const review = mongoose.model("product_review", productReviewSchema);
module.exports = review;
