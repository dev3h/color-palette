import mongoose, { Schema, model } from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var paletteSchema = new Schema(
  {
    colors: {
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
    tags: {
      colorTags: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ColorTag",
          required: true,
          unique: true,
        },
      ],
      collectionTags: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CollectionTag",
          required: true,
          unique: true,
        },
      ],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Export the model
export default model("Palette", paletteSchema);
