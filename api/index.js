const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);
const secret = "jaslkdhfosajfduwersdf";
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const Post = require("./models/Post");
// middlewares

// cors cross origin resource sharing allows all websites to access this backend
// this will allow cookie to be sent at server from front end
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
//  It parses incoming JSON data from the request body.

// cookie validation middleware
app.use(cookieParser());
// make sure files from uploads folder get used
app.use("/uploads", express.static(__dirname + "/uploads"));
// establish connection with mongoDB Atlas
mongoose.connect(
  "mongodb+srv://wanttousebard:q5sWXE8nScoHvGEm@cluster104.gj1y7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster104"
);
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userDoc = await User.findOne({ username });
  //   comparing bcrypted password with db password
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // syntax (payload,secretKey, expiration duration) followed by callback function (optional)
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        throw err;
      }
      // setting jwt as session cookie in browser
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
    //logged in
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  // cookie validation
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  res.json(req.cookies);
});

// deleting/resetting cookie
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("cookie has been reset");
});

// get post  data
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, summary, content } = req.body;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
  });
});

// uploadMiddleware.single("file") means:

// It expects a single file from the request with the field name "file".

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Invalid token");
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await postDoc.set({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    await postDoc.save();
    return res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.delete("/post/:id", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Invalid token");

    const { id } = req.params;
    const postDoc = await Post.findById(id);

    if (!postDoc) return res.status(404).json("Post not found");

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) return res.status(403).json("You are not the author");

    await Post.findByIdAndDelete(id);
    res.json("Post deleted successfully");
  });
});

app.listen(4000);
