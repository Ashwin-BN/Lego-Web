/********************************************************************************

* WEB322 – Assignment 06

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: Ashwin B N      Student ID: 112763222        Date: 19-04-2024

*

* Published URL: https://lovely-boa-knickers.cyclic.app/

*

********************************************************************************/

// Importing required modules
const express = require("express");
const dotenv = require("dotenv");

// Importing Sequelize models
const legoSets = require("./modules/legoSets");

// Load environment variables from .env file
dotenv.config();

const mongoose = require('mongoose')

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

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected Successfully);
  } catch (error) {
   throw error;
  }
}

app.get('/', (req, res) => {
  res.render("home")
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/lego/addSet", async (req, res) => {
  let themes = await legoSets.getAllThemes()
  res.render("addSet", { themes: themes })
});

app.post("/lego/addSet", async (req, res) => {
  try {
    await legoSets.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }

});

app.get("/lego/editSet/:num", async (req, res) => {

  try {
    let set = await legoSets.getSetByNum(req.params.num);
    let themes = await legoSets.getAllThemes();

    res.render("editSet", { set, themes });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }

});

app.post("/lego/editSet", async (req, res) => {

  try {
    await legoSets.editSet(req.body.set_num, req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

app.get("/lego/deleteSet/:num", async (req, res) => {
  try {
    await legoSets.deleteSet(req.params.num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
})

app.get("/lego/sets", async (req, res) => {

  let sets = [];

  try {
    if (req.query.theme) {
      sets = await legoSets.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoSets.getAllSets();
    }

    res.render("sets", { sets })
  } catch (err) {
    res.status(404).render("404", { message: err });
  }

});

app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoSets.getSetByNum(req.params.num);
    res.render("set", { set })
  } catch (err) {
    res.status(404).render("404", { message: err });
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
