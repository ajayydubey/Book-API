const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    id: Number,
    names: String,
    books: [String],
});
const AuthorModel =mongoose.model(AuthorSchema);
module.exports=AuthorModel;