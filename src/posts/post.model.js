import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is obligatory"],
  },
  category: {
    type: String,
    required: [true, "Category is obligatory"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  content: {
    type: String,
    required: [true, "Content is obligatory"],
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
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

export default mongoose.model("Post", PostSchema);
