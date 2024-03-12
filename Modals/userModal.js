import { Schema, model } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "name is required"],
  },
  username: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    lowercase: true,
    trim: true,
    unique: [true, "email is already registed"],
    validate(val) {
      if (!validator.isEmail(val)) throw new Error("Invalid Email");
    },
  },
  password: {
    type: String,
    trim: true,
    required: [true, "password is required"],
    minlength: 8,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  hash: {
    type: String,
  },
});

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.isVerifiedUser = async function (email) {
  const user = await userModel.findOne({ email });
  return user.verified;
};

userSchema.methods.sendVerificationMail = async function () {
  const user = this;
  // user.hash = uuid();
  await user.save();
  // const mailSent = await sendMail(user.email, link, hash)
  // return mailSent;
};

userSchema.statics.findUser = async function (email) {
  const user = await userModel.findOne({
    $or: [{ email }, { username: email }],
  });
  if (!user) return false;

  if (user.verified) return [1, user];

  return [2, "verify account and login"];
};

userSchema.statics.posibleUsername = async function (username) {
  const user = await userModel.findOne({ username });
  return user ? false : true;
};

userSchema.statics.newUserRegistration = async function ({
  name,
  username,
  email,
  password,
}) {
  const check = userSchema.findUser(email) || userSchema.findUser(username);
  if (check) return check;
  const encryptPassword = await bcrypt.hash(password, 10);
  const user = await userSchema({
    name,
    username,
    email,
    password: encryptPassword,
  });
  const mailsent = await user.sendVerificationMail();
  return mailsent;
};

userSchema.statics.userLogin = async function ({ email, password }) {
  const user = await userModel.findUser(email);
  if (user && typeof user[1] === "object") {
    const token = await user[1].generateToken();
    return [1, token];
  } else if (user) return [1, false];
  return [0, false];
};

userSchema.statics.findByCredentials = async function ({ email, password }) {
  const user = userModel.findUser(email);
  if (!user) return false;
  if (user.verified) {
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    return [1, isCorrectPassword];
  } else {
    return [0, false];
  }
};

const userModel = model("User", userSchema);

export default userModel;
