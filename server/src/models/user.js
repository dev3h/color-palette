import { Schema, model } from "mongoose"; // Erase if already required
import bcrypt from "bcryptjs";

// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    displayname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// trước khi lưu vào db, mã hóa password
userSchema.pre("save", async function (next) {
  // nếu mà password không được sửa thì bỏ qua
  if (!this.isModified("password")) next();

  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hashSync(this.password, salt);
  next();
});

//Export the model
export default model("User", userSchema);
