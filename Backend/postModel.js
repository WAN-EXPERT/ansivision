const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    id: String,
    name: String,
    ip: String,
    status: String,
    picture: String,
    categorie: String,
    types: Array
})

const Post = mongoose.model("Post", schema);
module.exports = Post;