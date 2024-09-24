/********************************************************************************

* WEB322 – Assignment 06

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: Ashwin B N      Student ID: 112763222        Date: 19-04-2024

* Published URL: https://lovely-boa-knickers.cyclic.app/

********************************************************************************/

// Importing required modules
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const legoSets = require("./modules/legoSets");
const authData = require("./modules/auth-service");
const clientSessions = require('client-sessions');

// Load environment variables from .env file
dotenv.config();

const mongoose = require('mongoose')

// Create an instance of Express
const app = express();

// Serving static files from the 'public' directory
app.use(express.static(__dirname + '/public'));


// Setting the view engine to EJS
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');


// Setting the HTTP port
const HTTP_PORT = process.env.PORT || 8080;

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Setting up client-sessions middleware for user authentication
app.use(clientSessions({
    cookieName: "session",
    secret: "assignment6_web322",
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
}));

// Middleware to make session data available in EJS views
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
   

app.get('/', (req, res) => {
  res.render("home")
});

// Middleware to ensure users are logged in before accessing certain routes
function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

// Route for homepage
app.get('/', (req, res) => {
    legoSets.getAllSets()
        .then((sets) => {
            res.render('home', { sets });
        })
        .catch((err) => {
            res.status(500).render('500', { message: "Internal server error occurred." });
        });
});

// Route for the about page
app.get('/about', (req, res) => {
    res.render('about');
});

// Route for adding a new LEGO set, only accessible if logged in
app.get('/lego/addSet', ensureLogin, async (req, res) => {
    try {
        let themes = await legoSets.getAllThemes();
        res.render("addSet", { themes });
    } catch (err) {
        res.status(500).render("500", { message: `Failed to retrieve themes: ${err}` });
    }
});

// POST route for adding a new LEGO set
app.post('/lego/addSet', ensureLogin, async (req, res) => {
  const setData = {
      name: req.body.name,
      year: parseInt(req.body.year),
      num_parts: parseInt(req.body.num_parts),
      img_url: req.body.img_url,
      theme_id: parseInt(req.body.theme_id),
      set_num: req.body.set_num
  };

  try {
      await legoData.addSet(setData);
      res.redirect('/lego/sets');
  } catch (err) {
      console.error(`Failed to add new set: ${err}`);
      res.status(500).render('500', { message: `Failed to add new set: ${err}` });
  }
});


// Route for editing a LEGO set
app.get("/lego/editSet/:num", ensureLogin, async (req, res) => {
    try {
        let set = await legoSets.getSetByNum(req.params.num);
        let themes = await legoSets.getAllThemes();
        res.render("editSet", { set, themes });
    } catch (err) {
        res.status(404).render("404", { message: err });
    }
});

// POST route for editing a LEGO set
app.post("/lego/editSet", ensureLogin, async (req, res) => {
    try {
        await legoSets.editSet(req.body.set_num, req.body);
        res.redirect("/lego/sets");
    } catch (err) {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
});

// Route for deleting a LEGO set
app.get("/lego/deleteSet/:num", ensureLogin, async (req, res) => {
    try {
        await legoSets.deleteSet(req.params.num);
        res.redirect("/lego/sets");
    } catch (err) {
        res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
});

// Route to display all LEGO sets, optionally filtered by theme
app.get("/lego/sets", async (req, res) => {
    try {
        let sets = req.query.theme ? await legoSets.getSetsByTheme(req.query.theme) : await legoSets.getAllSets();
        res.render("sets", { sets });
    } catch (err) {
        res.status(404).render("404", { message: err });
    }
});

// Route to display details of a specific LEGO set
app.get("/lego/sets/:num", async (req, res) => {
    try {
        let set = await legoSets.getSetByNum(req.params.num);
        res.render("set", { set });
    } catch (err) {
        res.status(404).render("404", { message: err });
    }
});

// Login, register, and user authentication routes
app.get('/login', (req, res) => {
  res.render('login', { page: '/login' });
});


app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    authData.checkUser(req.body)
        .then((user) => {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
            };
            res.redirect('/lego/sets');
        })
        .catch((err) => {
            res.render('login', { errorMessage: err, userName: req.body.userName, page:'/login' });
        });
});

app.get('/register', (req, res) => {
  res.render('register', { page: '/register' });
});

app.post('/register', (req, res) => {
    authData.registerUser(req.body)
        .then(() => {
            res.render('register', { successMessage: "User created" });
        })
        .catch((err) => {
            res.render('register', { errorMessage: err, userName: req.body.userName });
        });
});

// Route to logout
app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

// Route for user history
app.get('/userHistory', ensureLogin, (req, res) => {
    res.render('userHistory');
});

// Middleware to handle 404 errors for all other routes
app.use((req, res) => {
    res.status(404).render("404", { message: "Route Not Exist!" });
});

// Initialize the modules and start the server
legoSets.initialize()
    .then(authData.initialize)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server is running on http://localhost:${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Unable to start server: ${err}`);
    });

