const express = require("express"),
  app = express(),
  port = 3000,
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override");

// App Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Mongoose Setup, Schema & Model
mongoose.connect("mongodb://localhost:27017/blog_app", {
  useNewUrlParser: true
});

let blogScehma = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
let Blog = mongoose.model("Blog", blogScehma);

// RESTful Routes

// Index Route
app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) console.log(err);
    else res.render("index", { blogs: blogs });
  });
});
// New Route
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// Create Route
app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) console.log(err);
    else res.redirect("/blogs");
  });
});

// Show Route
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) res.redirect("/blogs");
    else res.render("show", { blog: foundBlog });
  });
});

// Edit Route
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) res.redirect("/blogs");
    else res.render("edit", { blog: foundBlog });
  });
});

// Update Route
app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) res.redirect("/");
    else res.redirect("/blogs/" + req.params.id);
  });
});

// Delete Route
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => res.redirect("/"));
});

app.listen(port, () => console.log(`Blog App is listening at port ${port}`));
