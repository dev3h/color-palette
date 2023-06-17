const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Declare the Schema of the Mongo model
var collectionTagSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

//Export the model

module.exports = model("CollectionTag", collectionTagSchema);
