const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();
const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend URL (or use * for development)
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// const allowedOrigins = ["http://localhost:5173", "http://localhost:3001"];
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

app.use(cors({ origin: "*", credentials: true }));

// Middleware
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET;

// Rate Limiting (100 requests/hour per user)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Mock Database
const users = [
  { username: "admin", password: bcrypt.hashSync("Hemant@123", 10) },
];
const products = [
  { id: 1, name: "iPhone 15", price: 999 },
  { id: 2, name: "MacBook Pro", price: 1999 },
];

// User Login (JWT Authentication)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  console.log(user);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  return res.json({ token });
});

// Middleware for JWT Authentication
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create a specific limiter for protected routes
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100,
    message: "Too many API requests, please try again later."
});

// Apply it to the products endpoint
app.get("/products", apiLimiter,  (req, res) => {
   return res.json(products);
});

// Start Server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
