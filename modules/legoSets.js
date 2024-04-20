require('dotenv').config();
const themeData = require("../data/themeData");
const setData = require("../data/setData");

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Connect to MongoDB using the connection string from the environment variables
mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));




// Define the Theme schema
const ThemeSchema = new Schema({
  id: {
      type: String,
      required: true,
      unique: true
  },
  name: {
    type: String,
    require: true
  }
});
const Theme = mongoose.model('Theme', ThemeSchema);

// Define the Set schema
const SetSchema = new Schema({
  set_num: {
      type: String,
      required: true,
      unique: true
  },
  name: {
      type: String,
      required: true
  },
  year: {
      type: Number,
      required: true
  },
  num_parts: {
      type: Number,
      required: true
  },
  theme_id: String,
  img_url: {
      type: String,
      required: true
  }
});

const Set = mongoose.model('Set', SetSchema);

module.exports = {
  Theme,
  Set,
};

// Initialize Database
async function initialize() {
  try {
    // Check if there are any themes in the database
    const themesCount = await Theme.countDocuments();
    if (themesCount === 0) {
      // Populate themes from themeData if database is empty
      await Theme.insertMany(themeData);
      console.log("Themes initialized in database.");
    }

    // Check if there are any sets in the database
    const setsCount = await Set.countDocuments();
    if (setsCount === 0) {
      // Populate sets from setData if database is empty
      await Set.insertMany(setData);
      console.log("Sets initialized in database.");
    }

    console.log("Database initialization complete.");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
}

// CRUD Operations
async function getAllSets() {
  try {
    const sets = await Set.find().populate("theme_id");
    return sets;
  } catch (err) {
    console.error("Error getting all sets:", err);
    throw err;
  }
}

async function getAllThemes() {
  try {
    const themes = await Theme.find();
    return themes;
  } catch (err) {
    console.error("Error getting all themes:", err);
    throw err;
  }
}

async function getSetByNum(setNum) {
  try {
    const foundSet = await Set.findOne({ set_num: setNum }).populate(
      "theme_id"
    );
    if (!foundSet) {
      throw new Error("Set not found");
    }
    return foundSet;
  } catch (err) {
    console.error("Error getting set by set number:", err);
    throw err;
  }
}

async function getSetsByTheme(theme) {
  try {
    // Find theme based on the theme name
    const foundTheme = await Theme.findOne({
      name: {
        $regex: new RegExp(theme, "i"),
      },
    });

    if (!foundTheme) {
      return [];
    }
    // Find sets based on the found theme id and populate the theme details
    const foundSets = await Set.find({ theme_id: foundTheme.id }).populate(
      "theme_id"
    );
    return foundSets;
  } catch (err) {
    console.error("Error getting sets by theme:", err);
    throw err;
  }
}

async function addSet(setData) {
  try {
    const newSet = await Set.create(setData);
    return newSet;
  } catch (err) {
    console.error("Error adding set:", err);
    throw err;
  }
}

async function editSet(setNum, setData) {
  try {
    const updatedSet = await Set.findOneAndUpdate(
      { set_num: setNum },
      setData,
      { new: true }
    );
    if (!updatedSet) {
      throw new Error("Set not found");
    }
    return updatedSet;
  } catch (err) {
    console.error("Error editing set:", err);
    throw err;
  }
}

async function deleteSet(setNum) {
  try {
    const deletedSet = await Set.findOneAndDelete({ set_num: setNum });
    if (!deletedSet) {
      throw new Error("Set not found");
    }
    return deletedSet;
  } catch (err) {
    console.error("Error deleting set:", err);
    throw err;
  }
}

module.exports = {
  initialize,
  getAllSets,
  getAllThemes,
  getSetByNum,
  getSetsByTheme,
  addSet,
  editSet,
  deleteSet,
};
