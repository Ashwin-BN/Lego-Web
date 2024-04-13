/********************************************************************************

* WEB322 – Assignment 05

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: Ashwin B N      Student ID: 112763222        Date: 12-04-2024

*

* Published URL: https://worrisome-lamb-suspenders.cyclic.app

*

********************************************************************************/

// Importing required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { Sequelize, DataTypes } = require("sequelize");

// Importing Sequelize models
const legoSets = require("./modules/legoSets");

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();

// Serving static files from the 'public' directory
app.use(express.static("public"));

// Setting the view engine to EJS
app.set("view engine", "ejs");

// Setting the HTTP port
const HTTP_PORT = process.env.PORT || 8080;

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Route for the root URL
app.get("/", (req, res) => {
  res.render("home");
});

// Route for the '/about' URL
app.get("/about", (req, res) => {
  res.render("about");
});

// Route for adding a new Lego set form
app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoSets.getAllThemes();
    res.render("addSet", { themes });
  } catch (error) {
    res.status(500).render("500", { message: error.message });
  }
});

// Route for handling the submission of the new Lego set form
app.post("/lego/addSet", async (req, res) => {
  try {
    await legoSets.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", { message: error.message });
  }
});

// Route for editing an existing Lego set form
app.get("/lego/editSet/:num", async (req, res) => {
  try {
    const set = await legoSets.getSetByNum(req.params.num);
    const themes = await legoSets.getAllThemes();
    res.render("editSet", { set, themes });
  } catch (error) {
    res.status(404).render("404", { message: error.message });
  }
});

// Route for handling the submission of the edited Lego set form
app.post("/lego/editSet", async (req, res) => {
  try {
    await legoSets.editSet(req.body.set_num, req.body);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", { message: error.message });
  }
});

// Route for deleting an existing Lego set
app.get("/lego/deleteSet/:num", async (req, res) => {
  try {
    await legoSets.deleteSet(req.params.num);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", { message: error.message });
  }
});

// Route for retrieving Lego sets
app.get("/lego/sets", async (req, res) => {
  try {
    const sets = await legoSets.getAllSets();
    res.render("sets", { sets });
  } catch (error) {
    res.status(500).render("500", { message: error.message });
  }
});

// Route for retrieving a specific Lego set by set number
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoSets.getSetByNum(req.params.set_num);
    if (set) {
      res.render("set", { set });
    } else {
      res.status(404).render("404", { message: "No Sets of Matching Set Number Found!" });
    }
  } catch (error) {
    res.status(500).render("500", { message: error.message });
  }
});

// Middleware to handle 404 errors for all other routes
app.use((req, res) => {
  res.status(404).render("404", { message: "Route Not Exist!" });
});

// Initializing the Lego data module and starting the server
legoSets.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server is running on http://localhost:${HTTP_PORT}`);
  });
});
