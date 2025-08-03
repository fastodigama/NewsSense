// index.js

/**
 * Required External Modules
 */
//import required modules
import express, { response } from "express";
import path from "path";
import "dotenv/config";
import summarizeRouter from "./modules/api/summarizeRouter.js"
import api from "./modules/api/api.js";


/**
 * App Variables
 */
const __dirname = import.meta.dirname;

//set up Express app

const app = express();
const port = process.env.PORT || 8888;
app.use(express.json());

/**
 *  App Configuration
 */
//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", summarizeRouter);

/**
 * Routes Definitions
 */

// Route for homepage, renders layout + news in table
app.get('/', async (req, res) => {
  const articles = await api.getNews();
  res.render('index', { articles });
});



app.get('/politics', async (req, res) => {
  const articles = await api.getNews('general');
  res.render('politics', { articles });
});
app.get('/technology', async (req, res) => {
  const articles = await api.getNews('technology');
  res.render('technology', { articles });
});
app.get('/business', async (req, res) => {
  const articles = await api.getNews('business');
  res.render('business', { articles });
});
app.get('/health', async (req, res) => {
  const articles = await api.getNews('health');
  res.render('health', { articles });
});
app.get('/entertainment', async (req, res) => {
  const articles = await api.getNews('entertainment');
  res.render('entertainment', { articles });
});
app.get('/sports', async (req, res) => {
  const articles = await api.getNews('Sports');
  res.render('Sports', { articles });
});
app.get('/science', async (req, res) => {
  const articles = await api.getNews('science');
  res.render('science', { articles });
});

/**
 * Server Activation
 */
app.listen(port, ()=>{
    console.log(`Listining to requests on http://localhost:${port}`);
});