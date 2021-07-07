const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    id: Number,
    names: String,
    books: [String],
});
const AuthorModel =mongoose.model("authors",AuthorSchema);
module.exports=AuthorModel;