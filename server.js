/********************************************************************************

* WEB322 – Assignment 04

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: Ashwin B N      Student ID: 112763222        Date: 18-03-2024

*

* Published URL: https://lovely-boa-knickers.cyclic.app


*

********************************************************************************/

// Importing required modules
const legoData = require("./modules/legoSets");
const express = require("express");
const path = require("path");

const app = express();

// Serving static files from the 'public' directory
app.use(express.static("public"));

// Setting the view engine to EJS
app.set("view engine", "ejs");

// Setting the HTTP port
const HTTP_PORT = process.env.PORT || 8080;

// Route for the root URL
app.get("/", (req, res) => {
  res.render("home");
});

// Route for the '/about' URL
app.get("/about", (req, res) => {
  res.render("about");
});

// Route for retrieving Lego sets
app.get("/lego/sets", async (req, res) => {
  console.log("/lego/sets");
  try {
    let legoSets;
    const theme = req.query.theme;

    // Retrieve Lego sets by theme if specified, otherwise retrieve all sets
    if (theme) {
      legoSets = await legoData.getSetsByTheme(theme);
    } else {
      legoSets = await legoData.getAllSets();
    }

    res.render('sets', {sets: legoSets})
  } catch (error) {
    // Handle errors and render the '404' view with appropriate message
    if (theme) {
      res
        .status(404)
        .render("404", { message: "No Sets of Matching Theme Found!" });
    } else {
      res.status(404).render("404", { message: "No Sets Found!" });
    }
  }
});

// Route for retrieving a specific Lego set by set number
app.get("/lego/sets/:set_num", async (req, res) => {
  console.log("/lego/sets/:set_num");
  try {
    const setNo = req.params.set_num;
    const legoSets = await legoData.getSetByNum(setNo);
    
    if (legoSets) {
      res.render("set", {set: legoSets})
    } else {
      res.status(404).render("404", {message: "No Sets of Matching Set Number Found!"});
    }
  } catch (error) {
    res
      .status(404)
      .render("404", { message: "No Sets of Matching Set Number Found!" });
  }
});

// Initializing the Lego data module and starting the server
legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server is running on http://localhost:${HTTP_PORT}`);
  });
});

// Middleware to handle 404 errors for all other routes
app.use((req, res, next) => {
  res.status(404).render("404", { message: "Route Not Exist!" });
});
