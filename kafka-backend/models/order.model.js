const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const orderSchema = new Schema(
  {
    rest_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    store_name: { type: String, required: true },
    store_address: { type: String, required: true },
    cust_name: { type: String, required: true },
    cust_address: { type: String, default: "Delivery" },
    order_status: { type: String, required: true },
    total_items: { type: String },
    mode: { type: String, required: true },
    order_total: { type: String, required: true },
    special_instruction: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
    summary: [
      {
        item_id: { type: mongoose.Schema.Types.ObjectId },
        item_name: { type: String },
        item_quantity: { type: Number },
        item_price: { type: String },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
