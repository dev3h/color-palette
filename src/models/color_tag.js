import { Schema, model } from "mongoose"; // Erase if already required

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
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
export default model("ColorTag", colorTagSchema);
