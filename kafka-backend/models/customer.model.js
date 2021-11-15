const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const Customer = mongoose.model(
  "Customer",
  new Schema(
    {
      first_name: {
        type: String,
        required: true,
        trim: true,
      },
      last_name: {
        type: String,
        required: true,
        trim: true,
      },
      phone_number: {
        type: String,
        required: [true, "Please enter the contact number"],
      },
      email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"],
      },
      password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
      },
      address: {
        street_address: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        zip: {
          type: Number,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        country: {
          type: String,
          required: true,
          trim: true,
        },
      },
      favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
      cart: {
        rest_id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        store_name: { type: String },
        store_address: { type: String },
        cust_name: { type: String },
        cust_address: { type: String },
        order_status: { type: String },
        total_items: { type: String },
        mode: { type: String },
        order_total: { type: String },
        special_instruction: { type: String },
        summary: [
          {
            item_id: { type: mongoose.Schema.Types.ObjectId },
            item_name: { type: String },
            item_quantity: { type: Number },
            item_price: { type: String },
          },
        ],
      },
      orders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          unique: true,
          ref: "Order",
        },
      ],
    },
    {
      versionKey: false,
    }
  )
);

module.exports = Customer;
