const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/sql-connection");
const router = express.Router();

// Register Page
// GET Register Page
router.get("/register", (req, res) => {
   res.render("register", { title: "Register", error: null, success: null });


  });
  
 
  

// Handle Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.render("register", {
      title: "Register",
      error: "All fields are required.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ]);
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.render("register", {
      title: "Register",
      error: "Error during registration.",
    });
  }
});

 // GET Login Page
 router.get("/login", (req, res) => {
    res.render("login", { title: "Login", error: "Invalid credentials", success: null });

  });

// Handle Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [[user]] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.render("login", { title: "Login", error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("login", { title: "Login", error: "Invalid credentials" });
    }

    req.session.user = user;
    res.redirect("/posts");
  } catch (err) {
    console.error(err);
    res.render("login", { title: "Login", error: "Server error" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.render("login", { error: "Email and password are required!", success: null });
    }
  
    try {
      // Check if user exists
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  
      if (users.length === 0) {
        return res.render("login", { error: "Invalid email or password", success: null });
      }
  
      const user = users[0];
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render("login", { error: "Invalid email or password", success: null });
      }
  
      // Save user in session
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
  
      res.redirect("/posts"); // Redirect after login
    } catch (err) {
      console.error(err);
      res.render("login", { error: "Server error", success: null });
    }
  });
// Logout user
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
        return res.status(500).send("Logout failed");
      }
      res.redirect("/login");
    });
  });
    

module.exports = router;
