const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Message = require("../models/Message");

const router = express.Router();

/* ==========================
   JWT VERIFY MIDDLEWARE
========================== */
const verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token nahi mila",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

/* ==========================
   REGISTER
========================== */
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const existingUser =
      await User.findOne({
        $or: [
          { email },
          { username },
        ],
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "Email ya Username already exist karta hai",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ==========================
   LOGIN
========================== */
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message:
          "Email ya Password galat hai",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Email ya Password galat hai",
      });
    }

    user.isOnline = true;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ==========================
   CURRENT USER
========================== */
router.get(
  "/me",
  verifyToken,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      res.json(user);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* ==========================
   ALL USERS
========================== */
router.get(
  "/users",
  verifyToken,
  async (req, res) => {
    try {
      const users =
        await User.find()
          .select("-password")
          .sort({
            username: 1,
          });

      res.json(users);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* ==========================
   UPDATE PROFILE
========================== */
router.put(
  "/profile",
  verifyToken,
  async (req, res) => {
    try {
      const {
        username,
        avatar,
        bio,
      } = req.body;

      const updatedUser =
        await User.findByIdAndUpdate(
          req.user.id,
          {
            username,
            avatar,
            bio,
          },
          {
            new: true,
          }
        ).select("-password");

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* ==========================
   ROOM MESSAGES
========================== */
router.get(
  "/messages/:room",
  verifyToken,
  async (req, res) => {
    try {
      const messages =
        await Message.find({
          room: req.params.room,
        }).sort({
          createdAt: 1,
        });

      res.json(messages);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* ==========================
   SAVE MESSAGE
========================== */
router.post(
  "/messages",
  verifyToken,
  async (req, res) => {
    try {
      const {
        room,
        text,
      } = req.body;

      const message =
        await Message.create({
          room,
          sender:
            req.user.username,
          senderId: req.user.id,
          text,
        });

      res.status(201).json(
        message
      );
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = router;