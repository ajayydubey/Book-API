const mongoose = require("mongoose");

const PublicationSchema = mongoose.Schema({
    id: Number,
    names: String,
    books: [String],
});
const PublicationModel =mongoose.model(PublicationSchema);
module.exports=PublicationModel;