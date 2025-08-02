// index.js

/**
 * Required External Modules
 */
//import required modules
import express, { response } from "express";
import path from "path";
import "dotenv/config";
import api from "./components/api/api.js";
/**
 * App Variables
 */
const __dirname = import.meta.dirname;

//set up Express app
const app = express();
const port = process.env.PORT || 8888;
/**
 *  App Configuration
 */
//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */

// Route for homepage, renders layout + news in table
app.get('/', async (req, res) => {
  const articles = await api.getTrendingNewsByCountry('ca');
  res.render('index', { title: "Home", articles, year: new Date().getFullYear() });
});

/**
 * Server Activation
 */
app.listen(port, ()=>{
    console.log(`Listining to requests on http://localhost:${port}`);
});