const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Declare the Schema of the Mongo model
var colorTagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    hex: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = model("ColorTag", colorTagSchema);
