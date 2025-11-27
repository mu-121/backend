import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // populate from User model
      required: true,
    },
    image: {
      type: String, // URL if uploaded to cloud
      default: null,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
