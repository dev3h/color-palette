import { Schema, model } from "mongoose"; // Erase if already required
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
      path: {
        type: String,
      },
      filename: {
        type: String,
      },
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

userSchema.methods = {
  // kiểm tra password
  isCorrectPassword: async function (password) {
    return await bcrypt.compareSync(password, this.password);
  },
  createPasswordChangeToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
  },
};

//Export the model
export default model("User", userSchema);
