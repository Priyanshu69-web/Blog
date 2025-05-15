const express = require("express");
const router = express.Router();
// Create New Post
const db = require("../db/sql-connection");

// Home Page
// Home Page - Show 3 Recent Blogs
router.get("/", async (req, res) => {
  try {
    const [recentPosts] = await db.query(
      "SELECT * FROM blogs ORDER BY createdAt DESC LIMIT 3"
    );

    res.render("layout", {
      title: "Welcome to MyBlogSpace",
      page: "index",
      recentPosts,
    });
  } catch (err) {
    console.error("Error fetching recent posts:", err);
    res.status(500).send("Server error");
  }
});


// All Blog Posts

// GET All Blog Posts
router.get("/posts", async (req, res) => {
  try {
    const [posts] = await db.query("SELECT * FROM blogs ORDER BY id DESC");
    res.render("layout", {
      title: "All Blog Posts",
      page: "posts", // this tells layout.ejs to include views/posts.ejs
      posts: posts,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Server error");
  }
});

// Show the Create Post Page
router.get("/create-post", (req, res) => {
  res.render("create-post", {
    title: "Create Post",
    error: null,
    success: null,
  });
});

// Handle Form Submission
router.post("/create-post", async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.render("create-post", {
      title: "Create Post",
      error: "All fields are required!",
      success: null,
    });
  }

  try {
    await db.query(
      "INSERT INTO blogs (title, content, category) VALUES (?, ?, ?)",
      [title, content, category]
    );
    res.render("create-post", {
      title: "Create Post",
      error: null,
      success: "Blog post created successfully!",
    });
  } catch (error) {
    console.error(error);
    res.render("create-post", {
      title: "Create Post",
      error: "Error creating blog post",
      success: null,
    });
  }
});

router.post("/posts/:id/comment", async (req, res) => {
  const postId = req.params.id;
  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).send("Name and comment are required.");
  }

  try {
    await db.query(
      "INSERT INTO comments (blog_id, name, comment) VALUES (?, ?, ?)",
      [postId, name, comment]
    );
    res.redirect(`/posts/${postId}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Server error");
  }
});

// View blogs by category
router.get("/category/:name", async (req, res) => {
  const category = req.params.name;

  try {
    const [posts] = await db.query(
      "SELECT * FROM blogs WHERE category = ? ORDER BY createdAt DESC",
      [category]
    );

    res.render("layout", {
      title: `Category: ${category}`,
      page: "posts",
      posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ✅ Show Edit Form
router.get("/posts/:id/edit", async (req, res) => {
  const postId = req.params.id;

  try {
    const [[post]] = await db.query("SELECT * FROM blogs WHERE id = ?", [postId]);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("edit-post", {
      title: "Edit Blog Post",
      post,
      error: null,
      success: null,
    });
  } catch (err) {
    console.error("Error loading post for editing:", err);
    res.status(500).send("Server error");
  }
});


router.post("/posts/:id/edit", async (req, res) => {
  const postId = req.params.id;
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.render("edit-post", {
      title: "Edit Blog Post",
      post: { id: postId, title, content, category },
      error: "All fields are required!",
      success: null,
    });
  }

  try {
    await db.query(
      "UPDATE blogs SET title = ?, content = ?, category = ? WHERE id = ?",
      [title, content, category, postId]
    );

    res.render("edit-post", {
      title: "Edit Blog Post",
      post: { id: postId, title, content, category },
      error: null,
      success: "Post updated successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/posts/:id/edit", async (req, res) => {
  const postId = req.params.id;
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.render("edit-post", {
      title: "Edit Blog Post",
      post: { id: postId, title, content, category },
      error: "All fields are required!",
      success: null,
    });
  }

  try {
    await db.query(
      "UPDATE blogs SET title = ?, content = ?, category = ? WHERE id = ?",
      [title, content, category, postId]
    );

    res.render("edit-post", {
      title: "Edit Blog Post",
      post: { id: postId, title, content, category },
      error: null,
      success: "Post updated successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/posts/:id/delete", async (req, res) => {
  const postId = req.params.id;

  try {
    await db.query("DELETE FROM blogs WHERE id = ?", [postId]);
    res.redirect("/posts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// View Single Post by ID
router.get("/posts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const [[post]] = await db.query("SELECT * FROM blogs WHERE id = ?", [
      postId,
    ]);
    const [comments] = await db.query(
      "SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at DESC",
      [postId]
    );

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("layout", {
      title: post.title,
      page: "post",
      post,
      comments,
    });
  } catch (error) {
    console.error("Error fetching post or comments:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
