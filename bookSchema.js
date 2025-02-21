const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "available",
    }
});

const Books = mongoose.model("Books", BookSchema);
module.exports = Books;
