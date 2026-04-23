const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  authorId: String,
  authorName: String
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);