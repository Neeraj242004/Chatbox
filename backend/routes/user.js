const express = require("express");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

router.post(
  "/avatar/:id",
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user =
        await User.findById(req.params.id);

      user.avatar =
        "http://localhost:5000/uploads/" +
        req.file.filename;

      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select(
      "_id username avatar"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;