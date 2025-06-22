const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const sharp = require("sharp");
const {LRUCache} = require("lru-cache");

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';


// Example route


const app = express();
app.use(cors());
app.use(express.json());

const IMAGE_DIR = path.join(__dirname, "cached_images");
if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR);

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjD3qv7LQxGDN4u7M3JhqYsnfnK9pboNcF7EV3J1Wm40aJiwtg_kQWKIKFU7AhkpQC/exec";

function extractDriveId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  return match ? match[1] : null;
}

const PRODUCT_JSON = path.join(__dirname, "data", "products.json"); // Adjust path as needed

async function preloadImages() {
  if (!fs.existsSync(PRODUCT_JSON)) {
    console.warn("No product data found for image preloading.");
    return;
  }

  const data = JSON.parse(fs.readFileSync(PRODUCT_JSON, "utf-8"));
  const urls = data.map(p => p["Image URL"]).filter(Boolean);

  for (const url of urls) {
    const fileId = extractDriveId(url);
    if (!fileId) continue;
    const filePath = path.join(IMAGE_DIR, `${fileId}.jpg`);
    if (fs.existsSync(filePath)) continue;

    try {
      const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const response = await axios.get(driveUrl, {
        responseType: "arraybuffer",
      });
      fs.writeFileSync(filePath, response.data);
      console.log(`✅ Cached image: ${fileId}`);
    } catch (err) {
      console.warn(`⚠️ Failed to preload image ${fileId}:`, err.message);
    }
  }
}


app.get('/', (req, res) => {
  res.send('Backend is running!');
});


// 🔐 LOGIN
app.post("/login", async (req, res) => {
  try {
    const response = await axios.post(SCRIPT_URL, {
      action: "login",
      username: req.body.username,
      password: req.body.password,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// 📦 GET PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const response = await axios.post(SCRIPT_URL, { action: "getProducts" });
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 🧾 PLACE ORDER
app.post("/place-order", async (req, res) => {
  const { user, placedBy, items, note, totalOriginal, totalDiscounted, date } = req.body;

  try {
    const response = await axios.post(SCRIPT_URL, {
      action: "placeOrder",
      user,
      placedBy,
      items,
      note,
      totalOriginal,
      totalDiscounted,
      date,
    });

    res.json(response.data);
  } catch (err) {
    console.error("Error placing order:", err.message);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// 👥 GET ALL USERS (admin)
app.get("/users", async (req, res) => {
  try {
    const response = await axios.post(SCRIPT_URL, { action: "getUsers" });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ➕ ADD USER
app.post("/add-user", async (req, res) => {
  const user = req.body;
  console.log(user)

  try {
    const response = await axios.post(SCRIPT_URL, {
      action: "addUser",
      user,
    });

    res.json(response.data);
  } catch (err) {
    console.error("Error adding user:", err.message);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// ❌ DELETE USER
app.post("/delete-user", async (req, res) => {
  const { username } = req.body;

  try {
    const response = await axios.post(SCRIPT_URL, {
      action: "deleteUser",
      username,
    });

    res.json(response.data);
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.get("/image", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing URL");

  const fileId = extractDriveId(url);
  if (!fileId) return res.status(400).send("Invalid Drive URL");

  const filePath = path.join(IMAGE_DIR, `${fileId}.jpg`);
  if (fs.existsSync(filePath)) {
    const mimeType = mime.lookup(filePath) || "image/jpeg";
    res.setHeader("Content-Type", mimeType);
    return fs.createReadStream(filePath).pipe(res);
  }

  try {
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const response = await axios.get(driveUrl, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(filePath, response.data);
    const mimeType = mime.lookup(filePath) || "image/jpeg";
    res.setHeader("Content-Type", mimeType);
    return res.sendFile(filePath);
  } catch (err) {
    console.error("Failed to fetch image:", err.message);
    return res.status(500).send("Error fetching image");
  }
});


// 🚀 START SERVER
app.listen(3001, async () => {
  console.log(`Proxy server running on http://${PORT}:${HOST}`);
  // await preloadImages(); // Start pre-caching images
});

