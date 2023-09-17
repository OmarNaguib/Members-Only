const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  postText: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
});

const Post = model("Post", postSchema);

module.exports = Post;
