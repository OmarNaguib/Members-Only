/* eslint-disable  */
const { model, Schema } = require("mongoose");
const { DateTime } = require("luxon");

const postSchema = new Schema({
  postText: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Date, required: true },
});

postSchema.virtual("formattedDate").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

const Post = model("Post", postSchema);

module.exports = Post;
