import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is obligatory"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is obligatory"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is obligatory"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["USER_ROLE", "ADMIN_ROLE"],
    default: "USER_ROLE",
  },
  profile_info: {
    name: {
      type: String,
    },
    avatar_url: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default mongoose.model("User", UserSchema);
