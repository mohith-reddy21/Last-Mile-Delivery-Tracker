const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    pickupAddress: {
      type: String,
      required: true
    },

    deliveryAddress: {
      type: String,
      required: true
    },

    packageDetails: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Picked Up",
        "Out for Delivery",
        "Delivered"
      ],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);