// Importing data files
const setData = require("../data/setData");
const themeData = require("../data/themeData");

// Array to store Lego set objects
let sets = [];

// Function to initialize the sets array with Lego set objects
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            /* Loop through each set in setData array, 
               To find theme data corresponding to theme_id of set */ 
            setData.forEach(setElement => {
                let theme = themeData.find(themeElement => themeElement.id === setElement.theme_id);
                if (theme) {
                    let setTheme = {...setElement, theme: theme.name};
                    sets.push(setTheme);
                }
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/* Function to get all Lego sets available:
   Check if sets array is not empty, if not resolve sets array  */
function getAllSets(){
    return new Promise((resolve,reject) => {
        if (sets.length > 0 ) {
            resolve(sets);
        } else{
            reject("No sets available !!!")
        }
    });
}

/* Function to get a Lego set by its set_num:
   Find set with matching set_num in sets array, if found resolve with set object */
function getSetByNum(setNum){
    return new Promise((resolve,reject) => {
        let setFound = sets.find(setToFind => setToFind.set_num == setNum);

        if(setFound){
            resolve(setFound);
        }else{
            reject(`Set not Found for given number(${setNum}) !!!`);
        }
    });
}

/* Function to get a Lego set by theme:
   Find set with matching theme(case insensitive) in sets array,
   if found resolve with set object */
function getSetsByTheme(theme){
    return new Promise((resolve, reject) => {
        let setsFound = sets.filter(setToFind => setToFind.theme.toLowerCase().includes(theme.toLowerCase()));

        if (setsFound.length > 0) {
            resolve(setsFound);
        }else{
            reject(`Set not Found for given theme(${theme}) !!!`);
        }
    });
}

// Exporting functions as module
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };


/* Testing the module functions
initialize()
  .then(() => {
    // Testing getAllSets
    console.log('All sets:');
    return getAllSets();
  })
  .then(allSets => {
    console.log(allSets);
    
    // Testing getSetByNum
    console.log('\nGet set by number:');
    return getSetByNum("001-1");
  })
  .then(set => {
    console.log(set);

    // Testing getSetsByTheme
    console.log('\nGet sets by theme:');
    return getSetsByTheme("Technic");
  })
  .then(setsByTheme => {
    console.log(setsByTheme);
  })
  .catch(error => {
    console.error('Error:', error);
  });
*/