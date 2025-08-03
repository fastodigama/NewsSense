// index.js

// Import required modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import summarizeRouter from "./modules/api/summarizeRouter.js";
import api from "./modules/api/api.js";

// Define current directory (ESM-compatible)
// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = import.meta.dirname;

// Create Express app and set port
const app = express();
const port = process.env.PORT || 8888;

// Enable JSON parsing for incoming requests
app.use(express.json());

// Configure view engine and static assets
app.set("views", path.join(__dirname, "views"));       // Set views directory
app.set("view engine", "pug");                          // Use Pug as the template engine
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Mount API routes
app.use("/api", summarizeRouter);

// Define route for homepage
app.get('/', async (req, res) => {
  const articles = await api.getNews();                 // Fetch general news
  res.render('index', { articles });                    // Render homepage with articles
});

// Define route for politics category
app.get('/politics', async (req, res) => {
  const articles = await api.getNews('general');        // Fetch general news (used for politics)
  res.render('politics', { articles });                 // Render politics page
});

// Define route for technology category
app.get('/technology', async (req, res) => {
  const articles = await api.getNews('technology');
  res.render('technology', { articles });
});

// Define route for business category
app.get('/business', async (req, res) => {
  const articles = await api.getNews('business');
  res.render('business', { articles });
});

// Define route for health category
app.get('/health', async (req, res) => {
  const articles = await api.getNews('health');
  res.render('health', { articles });
});

// Define route for entertainment category
app.get('/entertainment', async (req, res) => {
  const articles = await api.getNews('entertainment');
  res.render('entertainment', { articles });
});

// Define route for sports category
app.get('/sports', async (req, res) => {
  const articles = await api.getNews('Sports');         // Note: category name must match API expectations
  res.render('Sports', { articles });                   // Render sports page
});

// Define route for science category
app.get('/science', async (req, res) => {
  const articles = await api.getNews('science');
  res.render('science', { articles });
});

// Start the server
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
