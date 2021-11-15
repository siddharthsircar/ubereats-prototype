const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const itemSchema = new mongoose.Schema({
  rest_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  item_image: {
    type: String,
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  item_desc: {
    type: String,
  },
  item_type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  item_price: {
    type: String,
    required: true,
  },
});
const Item = mongoose.model("Item", itemSchema);

const Restaurant = mongoose.model(
  "Restaurant",
  new Schema(
    {
      store_image: {
        type: String,
        required: true,
        trim: true,
      },
      store_name: {
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
      timings: {
        type: String,
        required: true,
        trim: true,
      },
      delivery_mode: {
        type: String,
        required: true,
        trim: true,
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
          type: String,
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
      menu: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
      ],
      orders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      ],
    },
    {
      versionKey: false,
    }
  )
);

module.exports = { Restaurant, Item };
