const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})

const Article = mongoose.model("Article", ArticleSchema);

// Export my article model
module.exports = Article;