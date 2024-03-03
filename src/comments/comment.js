import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is obligatory"],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "A post is needed"],
  },
  content: {
    type: String,
    required: [true, "Content is obligatory"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Comment", CommentSchema);
