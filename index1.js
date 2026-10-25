const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/user");

const app = express();
const PORT = 3000;

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/users", userRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/youtubeapp1")
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });