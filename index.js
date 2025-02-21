require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const Books = require("./schemas/bookSchema");
const Users = require("./schemas/userSchema");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch((err) => console.error("❌ Database Connection Error:", err));

// 📌 POST - Add a new book
app.post("/books", async (req, res) => {
    try {
        const newBook = new Books(req.body);
        await newBook.save();
        res.status(201).json({ message: "Book Saved Successfully", book: newBook });
    } catch (error) {
        res.status(400).json({ message: "Error in saving Book", error });
    }
});

// 📌 GET - Retrieve all books
app.get("/books", async (req, res) => {
    try {
        const books = await Books.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error });
    }
});

// 📌 PUT - Update book by ID
app.put("/booksup/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Books.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book Updated", book: updatedBook });
    } catch (error) {
        res.status(400).json({ message: "Error updating book", error });
    }
});

// 📌 DELETE - Delete book by ID
app.delete("/booksdel/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Books.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book Deleted", book: deletedBook });
    } catch (error) {
        res.status(400).json({ message: "Error deleting book", error });
    }
});

// 📌 POST - Register a new user
app.post("/users", async (req, res) => {
    try {
        const newUser = new Users(req.body);
        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ message: "Error in saving User", error });
    }
});

// 📌 POST - Borrow a Book
app.post("/borrow", async (req, res) => {
    try {
        const { studentId, bookName } = req.body;

        // Check if the user exists
        const user = await Users.findOne({ studentId });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the book exists
        const book = await Books.findOne({ bookName });
        if (!book) return res.status(404).json({ message: "Book not found" });

        // Ensure the book isn't already borrowed
        if (book.status === "borrowed") {
            return res.status(400).json({ message: "Book is already borrowed" });
        }

        // Update book status
        book.status = "borrowed";
        book.borrowedBy = user._id;
        await book.save();

        res.json({ message: "Book borrowed successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Error borrowing book", error });
    }
});

// 📌 Start server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
