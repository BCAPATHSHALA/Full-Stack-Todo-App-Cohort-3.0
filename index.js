import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
const port = 3000;

// Path to the JSON file where users will be stored
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Current directory
const dataFilePath = path.join(__dirname, "users.json"); // Add user.json to the current directory

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public"))); // Parse the public folder as static files to serve it

// Utility function to read data from the file
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8"); // Read the data from the file
    return JSON.parse(data);
  } catch (err) {
    return []; // Return empty array if file doesn't exist or can't be read
  }
};

// Utility function to write data to the file
const writeDataToFile = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8"); // Write the data to the file
};

// Middleware to parse cookies to headers
const parseCookies = (req, res, next) => {
  const token = req.cookies.token; // Get the token from the cookies
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  next();
};

// Middleware to authenticate user
const isAuthenticated = (req, res, next) => {
  // Check the Authorization header
  let token = req.headers.authorization?.split(" ")[1];
  console.log("Token from header: ", token);

  if (!token) {
    // If token not found in Authorization header, check cookies
    token = req.cookies?.token;
    console.log("Token from cookies: ", token);
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "jwt-secretkey-for-todo-app");
    req.user = decoded.username; // Store the username in the request object
    next(); // Pass the request to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Signup route
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  // Read data from the file to check if the username already exists
  let users = readDataFromFile();

  // Check if the username already exists
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user with an empty todo list
  users.push({ username, password, todos: [] });
  writeDataToFile(users);

  res.status(201).json({ message: "User created successfully" });
});

// Login route
app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  // Read data from the file to check if the username and password are correct
  const users = readDataFromFile();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token to authenticate the user
  const token = jwt.sign({ username }, "jwt-secretkey-for-todo-app", {
    expiresIn: "1h",
  });

  // Set the token as a cookie in the response
  res.cookie("token", token, {
    secure: false, // set to true if your using HTTPS
    httpOnly: true, // set to true if you don't want the cookie to be accessible via JavaScript.
    expiresIn: "1h", // set the expiration time of the cookie to 1 hour
  });

  res.status(200).json({ message: "Login successful", token });
});

// Get user details
app.get("/me", isAuthenticated, (req, res) => {
  const users = readDataFromFile();
  const user = users.find((u) => u.username === req.user);

  res.status(200).json({ username: req.user, todos: user.todos });
});

// Logout user
app.post("/signout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

// Create TODO
app.post("/create-todos", isAuthenticated, (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: "Task description is required" });
  }

  let users = readDataFromFile();
  const user = users.find((u) => u.username === req.user);

  user.todos.push({ id: Date.now(), task, completed: false });
  writeDataToFile(users);

  res.status(201).json({ message: "TODO created successfully" });
});

// Fetch all TODOs
app.get("/all-todos", isAuthenticated, (req, res) => {
  const users = readDataFromFile();
  const user = users.find((u) => u.username === req.user);

  res.status(200).json({ todos: user.todos });
});

// Update TODO (mark as done/undone)
app.patch("/update-todos/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  let users = readDataFromFile();
  const user = users.find((u) => u.username === req.user);

  const todo = user.todos.find((t) => t.id == id);
  if (!todo) {
    return res.status(404).json({ message: "TODO not found" });
  }

  todo.completed = !todo.completed;
  writeDataToFile(users);

  if (todo.completed) {
    res.status(200).json({ message: "TODO marked as done" });
  } else {
    res.status(200).json({ message: "TODO marked as undone" });
  }
});

// Delete TODO
app.delete("/delete-todos/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  let users = readDataFromFile();
  const user = users.find((u) => u.username === req.user);

  const todoIndex = user.todos.findIndex((t) => t.id == id);
  if (todoIndex === -1) {
    return res.status(404).json({ message: "TODO not found" });
  }

  user.todos.splice(todoIndex, 1);
  writeDataToFile(users);

  res.status(200).json({ message: "TODO deleted successfully" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
